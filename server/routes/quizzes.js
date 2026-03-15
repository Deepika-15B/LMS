const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Get all active quizzes (For Students)
 * @route   GET /api/quizzes
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 });
    
    // Do not send correctAnswers to students!
    const sanitizedQuizzes = quizzes.map(quiz => {
       const q = quiz.toObject();
       q.questions.forEach(question => {
         delete question.correctAnswer;
         delete question.explanation;
       });
       return q;
    });

    res.json(sanitizedQuizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Get ALL quizzes including inactive ones (For Admin)
 * @route   GET /api/quizzes/all
 * @access  Private/Admin
 */
router.get('/all', adminAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 });
    // Admin gets full access including answers
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Get a specific quiz
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'username fullName');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is neither admin nor the creator, hide answers
    if (req.user.role !== 'admin' && !(quiz.createdBy._id.equals(req.user._id))) {
      const sanitized = quiz.toObject();
      sanitized.questions.forEach(q => {
         delete q.correctAnswer;
         delete q.explanation;
      });
      return res.json(sanitized);
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Create a new Quiz
 * @route   POST /api/quizzes
 * @access  Private/Admin
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, category, level, questions, isActive, timeLimit } = req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      level,
      questions,
      isActive: isActive !== undefined ? isActive : true,
      timeLimit,
      createdBy: req.user._id
    });

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('createdBy', 'username fullName');

    res.status(201).json(populatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz', error: error.message });
  }
});

/**
 * @desc    Update a Quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private/Admin
 */
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username fullName');

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quiz', error: error.message });
  }
});

/**
 * @desc    Delete a Quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private/Admin
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Submit a Quiz for grading
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // Map of { questionIndex: chosenOptionIndex }
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const results = quiz.questions.map((question, index) => {
      const chosenAnswer = answers[index];
      // Use loose comparison to handle potential string/number mismatches
      const isCorrect = chosenAnswer != null && Number(chosenAnswer) === question.correctAnswer;
      
      if (isCorrect) score++;
      
      return {
        questionText: question.questionText,
        isCorrect,
        correctAnswer: question.correctAnswer,
        chosenAnswer: chosenAnswer,
        explanation: question.explanation
      };
    });

    console.log(`Quiz submission for ${quiz.title}: Score ${score}/${quiz.questions.length}`);

    const percentage = (score / quiz.questions.length) * 100;

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
  }
});

module.exports = router;
