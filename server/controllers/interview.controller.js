import Interview from "../models/interview.model.js"

// 1. Create a new interview (admin only ideally)
export const createInterview = async (req, res) => {
  try {
    const { title, questions,difficulty } = req.body;
    const createdBy = req.user._id;

    const newInterview = new Interview({
      title,
      questions,
      difficulty,
      createdBy
    });

    await newInterview.save();
    res.status(201).json({ success:true,message: 'Interview created successfully', data: newInterview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message: 'Server Error' });
  }
};

// 2. Get all interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('createdBy', 'name email');
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message: 'Server Error' });
  }
};

// 3. Get interview by ID
export const  getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('createdBy', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 4. Delete interview (if admin wants to delete)
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Interview.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success:false,message: 'Interview not found' });
    }

    res.status(200).json({ success:true,message: 'Interview deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Server Error' });
  }
};
