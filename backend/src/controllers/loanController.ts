import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Loan from '../models/Loan';
import Payment from '../models/Payment';
import { runBRE } from '../utils/bre';

// --- Borrower Actions ---

export const submitDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { dob, salary, pan, employmentStatus } = req.body;
    const userId = req.user?._id;

    const breResult = runBRE({ dob: new Date(dob), salary, pan, employmentStatus });
    if (!breResult.passed) {
      return res.status(400).json({ 
        message: 'Eligibility check failed', 
        errors: breResult.errors 
      });
    }

    await User.findByIdAndUpdate(userId, {
      dob: new Date(dob),
      salary,
      pan,
      employmentStatus
    });

    res.json({ message: 'Personal details verified and saved' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, tenure, salarySlipUrl } = req.body;
    const userId = req.user?._id;

    const loan = new Loan({
      borrowerId: userId,
      amount,
      tenure,
      salarySlipUrl,
      status: 'Applied'
    });

    await loan.save();
    res.status(201).json({ message: 'Loan application submitted successfully', loan });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --- Sales Dashboard ---
export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    // Users who registered but haven't applied for a loan yet
    const usersWithLoans = await Loan.distinct('borrowerId');
    const leads = await User.find({ 
      _id: { $nin: usersWithLoans },
      role: 'Borrower'
    });
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --- Sanction Dashboard ---
export const getAppliedLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'Applied' }).populate('borrowerId', 'name email salary pan');
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLoanStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId } = req.params;
    const { status, rejectionReason } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = status;
    if (status === 'Rejected') loan.rejectionReason = rejectionReason;
    if (status === 'Sanctioned') loan.sanctionedAt = new Date();

    await loan.save();
    res.json({ message: `Loan ${status.toLowerCase()} successfully`, loan });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --- Disbursement Dashboard ---
export const getSanctionedLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'Sanctioned' }).populate('borrowerId', 'name email');
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const recordDisbursement = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'Disbursed';
    loan.disbursedAt = new Date();
    await loan.save();

    res.json({ message: 'Loan marked as disbursed', loan });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// --- Collection Dashboard ---
export const getActiveLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'Disbursed' }).populate('borrowerId', 'name email');
    // Calculate outstanding for each loan
    const loansWithOutstanding = await Promise.all(loans.map(async (loan) => {
      const payments = await Payment.find({ loanId: loan._id });
      const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
      
      const SI = (loan.amount * loan.interestRate * loan.tenure) / (365 * 100);
      const totalRepayment = loan.amount + SI;
      
      return {
        ...loan.toObject(),
        totalRepayment,
        totalPaid,
        outstanding: totalRepayment - totalPaid
      };
    }));
    
    res.json(loansWithOutstanding);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId } = req.params;
    const { utr, amount, date } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const payment = new Payment({
      loanId,
      utr,
      amount,
      date: new Date(date)
    });

    await payment.save();

    // Check if loan is fully paid
    const payments = await Payment.find({ loanId: loan._id });
    const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    
    const SI = (loan.amount * loan.interestRate * loan.tenure) / (365 * 100);
    const totalRepayment = loan.amount + SI;

    if (totalPaid >= totalRepayment) {
      loan.status = 'Closed';
      loan.closedAt = new Date();
      await loan.save();
    }

    res.json({ message: 'Payment recorded successfully', payment, loanStatus: loan.status });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate UTR number' });
    }
    res.status(500).json({ message: err.message });
  }
};
