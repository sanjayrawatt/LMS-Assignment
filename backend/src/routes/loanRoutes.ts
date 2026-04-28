import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  submitDetails, 
  applyLoan, 
  getLeads, 
  getAppliedLoans, 
  updateLoanStatus, 
  getSanctionedLoans, 
  recordDisbursement, 
  getActiveLoans, 
  recordPayment 
} from '../controllers/loanController';

const router = express.Router();

// Borrower Routes
router.post('/submit-details', authenticate, authorize(['Borrower']), submitDetails);
router.post('/apply', authenticate, authorize(['Borrower']), applyLoan);

// Sales Routes
router.get('/leads', authenticate, authorize(['Sales', 'Admin']), getLeads);

// Sanction Routes
router.get('/applied', authenticate, authorize(['Sanction', 'Admin']), getAppliedLoans);
router.patch('/:loanId/status', authenticate, authorize(['Sanction', 'Admin']), updateLoanStatus);

// Disbursement Routes
router.get('/sanctioned', authenticate, authorize(['Disbursement', 'Admin']), getSanctionedLoans);
router.patch('/:loanId/disburse', authenticate, authorize(['Disbursement', 'Admin']), recordDisbursement);

// Collection Routes
router.get('/active', authenticate, authorize(['Collection', 'Admin']), getActiveLoans);
router.post('/:loanId/payment', authenticate, authorize(['Collection', 'Admin']), recordPayment);

export default router;
