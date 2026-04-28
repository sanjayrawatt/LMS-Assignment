import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  loanId: mongoose.Types.ObjectId;
  utr: string;
  amount: number;
  date: Date;
}

const PaymentSchema: Schema = new Schema({
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
  utr: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
