import mongoose, { Document } from 'mongoose'

export interface ISubmission extends Document {
  user: string;
  problem: string;
  code: string;
  language: string;
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  executionTime?: number;
  memoryUsage?: number;
  createdAt: Date;
}

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'cpp', 'java'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'],
    default: 'Pending',
  },
  executionTime: Number,
  memoryUsage: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema) 