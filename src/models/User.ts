import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  solvedProblems: string[];
  submissions: string[];
  rating: number;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: String,
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  rating: {
    type: Number,
    default: 1500
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema) 