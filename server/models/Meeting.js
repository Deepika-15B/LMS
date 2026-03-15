const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: false // Optional, in case course doesn't exist in system
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String, // Format: "HH:MM" (e.g., "14:30")
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: 15,
    max: 480 // Max 8 hours
  },
  meetingRoomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  meetingUrl: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
meetingSchema.index({ scheduledDate: 1, scheduledTime: 1 });
meetingSchema.index({ instructor: 1 });
meetingSchema.index({ course: 1 });
meetingSchema.index({ status: 1 });

meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to generate unique meeting room ID
meetingSchema.statics.generateRoomId = function(courseName) {
  const timestamp = Date.now();
  const sanitizedCourseName = courseName
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .substring(0, 30);
  return `${sanitizedCourseName}-${timestamp}`;
};

module.exports = mongoose.model('Meeting', meetingSchema);

