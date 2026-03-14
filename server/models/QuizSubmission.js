const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['passed', 'failed'],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  maxAttempts: {
    type: Number,
    required: true,
    default: 3
  },
  answers: [{
    questionId: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true
    },
    correct: {
      type: Boolean,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
quizSubmissionSchema.index({ student: 1, courseId: 1 });
quizSubmissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
