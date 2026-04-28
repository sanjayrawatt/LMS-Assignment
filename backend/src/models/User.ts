import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Borrower' | 'Sales' | 'Sanction' | 'Disbursement' | 'Collection' | 'Admin';
  dob?: Date;
  salary?: number;
  employmentStatus?: 'Salaried' | 'Self-Employed' | 'Unemployed';
  pan?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Borrower', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Admin'], 
    default: 'Borrower' 
  },
  dob: { type: Date },
  salary: { type: Number },
  employmentStatus: { 
    type: String, 
    enum: ['Salaried', 'Self-Employed', 'Unemployed'] 
  },
  pan: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
