const express = require('express');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const { auth, adminAuth } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Jitsi Meet base URL - can be configured via environment variable
const JITSI_BASE_URL = process.env.JITSI_BASE_URL || 'https://meet.jit.si';

/**
 * @desc    Create a new meeting (Admin/Instructor only)
 * @route   POST /api/meetings
 * @access  Private/Admin
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, courseName, courseId, description, scheduledDate, scheduledTime, duration } = req.body;

    // Validate required fields
    if (!title || !courseName || !scheduledDate || !scheduledTime || !duration) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, courseName, scheduledDate, scheduledTime, and duration are required' 
      });
    }

    // Validate date and time
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (isNaN(scheduledDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // Check if meeting is scheduled in the past
    if (scheduledDateTime < new Date()) {
      return res.status(400).json({ message: 'Cannot schedule a meeting in the past' });
    }

    // Validate duration
    if (duration < 15 || duration > 480) {
      return res.status(400).json({ message: 'Duration must be between 15 and 480 minutes' });
    }

    // Generate unique meeting room ID
    const meetingRoomId = Meeting.generateRoomId(courseName);
    const meetingUrl = `${JITSI_BASE_URL}/${meetingRoomId}`;

    // Create meeting
    const meeting = new Meeting({
      title,
      courseName,
       course: mongoose.Types.ObjectId.isValid(courseId) ? courseId : null,
      description: description || '',
      scheduledDate: scheduledDateTime,
      scheduledTime,
      duration,
      meetingRoomId,
      meetingUrl,
      instructor: req.user._id,
      instructorName: req.user.fullName || req.user.username
    });

    await meeting.save();
    await meeting.populate('instructor', 'fullName username email');
    if (meeting.course) {
      await meeting.populate('course', 'title');
    }

    res.status(201).json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Get all meetings for students (all scheduled meetings visible)
 * @route   GET /api/meetings/student
 * @access  Private
 */
router.get('/student', auth, async (req, res) => {
  try {
    // Get all scheduled and ongoing meetings for students.
    // Students can see all meetings - enrollment is checked when joining.
    // We return them directly and let the client determine whether they are
    // upcoming, live, or ended based on its own time logic.
    const meetings = await Meeting.find({
      status: { $in: ['scheduled', 'ongoing'] }
    })
      .populate('instructor', 'fullName username email')
      .populate('course', 'title')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    console.log(`Found ${meetings.length} meetings for student`); // Debug log
    
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching student meetings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Get all meetings for instructors (meetings they created)
 * @route   GET /api/meetings/instructor
 * @access  Private/Admin
 */
router.get('/instructor', adminAuth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ instructor: req.user._id })
      .populate('instructor', 'fullName username email')
      .populate('course', 'title')
      .populate('enrolledStudents', 'fullName username email')
      .sort({ scheduledDate: -1, scheduledTime: -1 });

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching instructor meetings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Get a single meeting by ID
 * @route   GET /api/meetings/:id
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('instructor', 'fullName username email')
      .populate('course', 'title')
      .populate('enrolledStudents', 'fullName username email');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check access: instructor can see their own meetings, students can see enrolled course meetings
    if (req.user.role === 'admin' || meeting.instructor._id.toString() === req.user._id.toString()) {
      return res.json(meeting);
    }

    // For students, check if they're enrolled in the course
    const user = await User.findById(req.user._id);
    const enrolledCourseIds = user.enrolledCourses.map(course => course.toString());
    
    if (meeting.course && enrolledCourseIds.includes(meeting.course._id.toString())) {
      return res.json(meeting);
    }

    // Check if student is explicitly enrolled in the meeting
    const isEnrolled = meeting.enrolledStudents.some(
      student => student._id.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.json(meeting);
    }

    // Allow students to access meeting details even if not enrolled
    // Enrollment happens when they join
    return res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Update a meeting (Instructor only)
 * @route   PUT /api/meetings/:id
 * @access  Private/Admin
 */
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is the instructor who created the meeting
    if (meeting.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only update your own meetings.' });
    }

    const { title, courseName, description, scheduledDate, scheduledTime, duration, status } = req.body;

    // Update fields if provided
    if (title) meeting.title = title;
    if (courseName) meeting.courseName = courseName;
    if (description !== undefined) meeting.description = description;
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (isNaN(scheduledDateTime.getTime())) {
        return res.status(400).json({ message: 'Invalid date or time format' });
      }
      meeting.scheduledDate = scheduledDateTime;
      meeting.scheduledTime = scheduledTime;
    }
    if (duration) {
      if (duration < 15 || duration > 480) {
        return res.status(400).json({ message: 'Duration must be between 15 and 480 minutes' });
      }
      meeting.duration = duration;
    }
    if (status && ['scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      meeting.status = status;
    }

    await meeting.save();
    await meeting.populate('instructor', 'fullName username email');
    await meeting.populate('course', 'title');
    await meeting.populate('enrolledStudents', 'fullName username email');

    res.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Delete a meeting (Instructor only)
 * @route   DELETE /api/meetings/:id
 * @access  Private/Admin
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is the instructor who created the meeting
    if (meeting.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own meetings.' });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Join a meeting (add student to enrolled list if not already enrolled)
 * @route   POST /api/meetings/:id/join
 * @access  Private
 */
router.post('/:id/join', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is already enrolled
    const isEnrolled = meeting.enrolledStudents.some(
      student => student.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      meeting.enrolledStudents.push(req.user._id);
      await meeting.save();
    }

    // Return meeting details with access granted
    await meeting.populate('instructor', 'fullName username email');
    await meeting.populate('course', 'title');

    res.json({
      message: 'Access granted',
      meeting: meeting
    });
  } catch (error) {
    console.error('Error joining meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

