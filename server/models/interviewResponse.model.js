import mongoose from 'mongoose';

const interviewResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: String, default:"" },
      feedback: { type: String }
    }
  ],
  overallFeedback:{type:String}
}, { timestamps: true });

const InterviewResponse= mongoose.model('InterviewResponse', interviewResponseSchema);
export default InterviewResponse;
