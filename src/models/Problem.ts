import mongoose, { Document } from 'mongoose'

interface ITestCase {
  input: string;
  output: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: ITestCase[];
  timeLimit: number;
  memoryLimit: number;
  createdAt: Date;
}

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  testCases: [{
    input: String,
    output: String,
  }],
  timeLimit: {
    type: Number,
    default: 1000, // 毫秒
  },
  memoryLimit: {
    type: Number,
    default: 256, // MB
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema) 