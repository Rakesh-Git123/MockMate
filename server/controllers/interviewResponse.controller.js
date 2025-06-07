import InterviewResponse from '../models/interviewResponse.model.js';
import Interview from '../models/interview.model.js';

export const submitInterviewResponse = async (req, res) => {
  try {
    const { interviewId, responses } = req.body;
    const userId = req.user._id;

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const responsesWithFeedback = [];

    for (let r of responses) {
      const prompt = `Give detailed feedback for the following answer to the question.\n
      Question: ${r.question}\n
      Answer: ${r.answer}\n
      Only provide feedback, no greetings.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await geminiRes.json();
      const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "Feedback not available.";

      responsesWithFeedback.push({
        question: r.question,
        answer: r.answer,
        feedback,
      });
    }

    const overallFeedbackPrompt = `Please provide a brief and simple overall feedback on the candidate's interview answers below.  
Keep it short, clear, and constructive and at last give the rating in the form rating/10.\n
Questions and Answers:\n
${responses.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')}`;

    const overallFeedbackResult = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: overallFeedbackPrompt }]
            }
          ]
        })
      }
    );

    const overallData = await overallFeedbackResult.json();
    const overallFeedback = overallData.candidates?.[0]?.content?.parts?.[0]?.text || "Feedback not available.";

    const newResponse = new InterviewResponse({
      user: userId,
      interview: interviewId,
      responses: responsesWithFeedback,
      overallFeedback
    });

    await newResponse.save();

    res.status(201).json({
      success: true,
      message: 'Interview response submitted successfully',
      data: newResponse
    });

  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserResponses = async (req, res) => {
  try {
    const userId = req.user._id;

    const responses = await InterviewResponse.find({ user: userId }).populate('interview');

    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getResponseByUserAndInterviewId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { interviewId } = req.params;

    const response = await InterviewResponse.findOne({
      user: userId,
      interview: interviewId,
    }).populate('interview');

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

