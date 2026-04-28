import mongoose, { Schema, Document } from 'mongoose';

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  interestRate: number;
  status: 'Applied' | 'Sanctioned' | 'Disbursed' | 'Closed' | 'Rejected';
  rejectionReason?: string;
  salarySlipUrl?: string;
  appliedAt: Date;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
}

const LoanSchema: Schema = new Schema({
  borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  interestRate: { type: Number, default: 12 },
  status: { 
    type: String, 
    enum: ['Applied', 'Sanctioned', 'Disbursed', 'Closed', 'Rejected'], 
    default: 'Applied' 
  },
  rejectionReason: { type: String },
  salarySlipUrl: { type: String },
  appliedAt: { type: Date, default: Date.now },
  sanctionedAt: { type: Date },
  disbursedAt: { type: Date },
  closedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<ILoan>('Loan', LoanSchema);
