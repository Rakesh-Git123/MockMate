import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [
    {
      type: String,
      required: true
    }
  ],
  difficulty: { type: String, default: 'Easy' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const Interview=mongoose.model("Interview",interviewSchema);
export default Interview;
