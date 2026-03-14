const express = require('express');
const router = express.Router();
const QuizSubmission = require('../models/QuizSubmission');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/auth');

// Get all quiz submissions (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate('student', 'fullName email username')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz submissions for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if user is admin or accessing their own data
    if (req.user.role !== 'admin' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const submissions = await QuizSubmission.find({ student: studentId })
      .populate('student', 'fullName email username')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching student quiz submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz submissions for a specific course
router.get('/course/:courseId', adminAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const submissions = await QuizSubmission.find({ courseId })
      .populate('student', 'fullName email username')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching course quiz submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit a quiz (students only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      score,
      totalQuestions,
      percentage,
      status,
      timeSpent,
      attemptNumber,
      maxAttempts,
      answers
    } = req.body;

    // Validate required fields
    if (!courseId || !courseName || score === undefined || !totalQuestions || 
        percentage === undefined || !status || timeSpent === undefined || 
        !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if student has already submitted this quiz
    const existingSubmission = await QuizSubmission.findOne({
      student: req.user._id,
      courseId
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        message: 'You have already submitted this quiz',
        existingSubmission: existingSubmission._id
      });
    }

    // Create new quiz submission
    const submission = new QuizSubmission({
      student: req.user._id,
      courseId,
      courseName,
      score,
      totalQuestions,
      percentage,
      status,
      timeSpent,
      attemptNumber: attemptNumber || 1,
      maxAttempts: maxAttempts || 3,
      answers
    });

    await submission.save();
    
    // Populate student info for response
    await submission.populate('student', 'fullName email username');
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz submission statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await QuizSubmission.aggregate([
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          passedSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] }
          },
          failedSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          averageScore: { $avg: '$percentage' },
          firstAttempts: {
            $sum: { $cond: [{ $eq: ['$attemptNumber', 1] }, 1, 0] }
          },
          retakes: {
            $sum: { $cond: [{ $gt: ['$attemptNumber', 1] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalSubmissions: 0,
      passedSubmissions: 0,
      failedSubmissions: 0,
      averageScore: 0,
      firstAttempts: 0,
      retakes: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching quiz statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a quiz submission (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const submission = await QuizSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Quiz submission not found' });
    }

    await QuizSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
