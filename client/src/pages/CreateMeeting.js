import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaVideo, FaCalendarAlt, FaClock, FaBook, FaFileAlt, FaTimes } from 'react-icons/fa';
import './CreateMeeting.css';

const CreateMeeting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingMeetings, setExistingMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [meetingsError, setMeetingsError] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  // Static course options to show in dropdown in addition to quizzes
  const staticCourses = [
    'MongoDB',
    'React',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'Data Structures',
    'Algorithms',
    'Java',
    'Python',
    'Node.js'
  ];
  
  const [formData, setFormData] = useState({
    title: '',
    courseName: '',
    courseId: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60
  });

  useEffect(() => {
    fetchQuizzes();
    fetchMeetings();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/api/quizzes/all');
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoadingMeetings(true);
      const res = await axios.get('/api/meetings/instructor');
      setExistingMeetings(res.data);
      setMeetingsError('');
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setMeetingsError(err.response?.data?.message || 'Failed to load existing meetings');
    } finally {
      setLoadingMeetings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If a course is selected from dropdown, update courseName when value matches static course name
    if (name === 'courseId' && staticCourses.includes(value)) {
      setFormData(prev => ({
        ...prev,
        courseName: value
      }));
      return;
    }

    // If a course is selected from quizzes dropdown, update courseName from quiz title
    if (name === 'courseId') {
      const selectedQuiz = quizzes.find(q => q._id === value);
      if (selectedQuiz) {
        setFormData(prev => ({
          ...prev,
          courseName: selectedQuiz.title
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/meetings', formData);
      setSuccess('Meeting created successfully!');
      setFormData({
        title: '',
        courseName: '',
        courseId: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/meetings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-meeting-page animate-fade-in">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FaVideo className="title-icon" />
            Schedule Live Class
          </h1>
          <p className="page-subtitle">Create a new live online class using Jitsi Meet</p>
        </div>

        {/* Existing meetings list before the new meeting form */}
        <div className="existing-meetings-section card glass-panel mb-3">
          <h2 className="section-title">Your Scheduled Meetings</h2>
          {loadingMeetings ? (
            <div className="loading-inline">
              <div className="loading-spinner small"></div>
              <span>Loading your meetings...</span>
            </div>
          ) : meetingsError ? (
            <div className="alert alert-error">
              <FaTimes className="alert-icon" />
              {meetingsError}
            </div>
          ) : existingMeetings.length === 0 ? (
            <p className="text-secondary">You have not scheduled any meetings yet.</p>
          ) : (
            <div className="existing-meetings-list">
              <p className="text-secondary mb-1">
                You have <strong>{existingMeetings.length}</strong> meeting
                {existingMeetings.length !== 1 && 's'} scheduled.
              </p>
              <ul className="existing-meetings-items">
                {existingMeetings.map(meeting => (
                  <li key={meeting._id} className="existing-meeting-item">
                    <div className="existing-meeting-main">
                      <span className="meeting-title">{meeting.title}</span>
                      <span className="meeting-course">{meeting.courseName}</span>
                    </div>
                    <div className="existing-meeting-meta">
                      <span>
                        <FaCalendarAlt className="meta-icon" /> {new Date(meeting.scheduledDate).toLocaleDateString()}
                      </span>
                      <span>
                        <FaClock className="meta-icon" /> {meeting.scheduledTime} ({meeting.duration} mins)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <FaTimes className="alert-icon" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FaVideo className="alert-icon" />
            {success}
          </div>
        )}

        <div className="meeting-form-card card glass-panel">
          <form onSubmit={handleSubmit} className="meeting-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <FaVideo className="label-icon" />
                Meeting Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Introduction to React Hooks"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="courseId" className="form-label">
                  <FaBook className="label-icon" />
                  Course (Optional)
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select a course (optional)</option>
                  {/* Static course options */}
                  {staticCourses.map((courseName) => (
                    <option key={courseName} value={courseName}>
                      {courseName}
                    </option>
                  ))}
                  {/* Dynamic quizzes from backend */}
                  {quizzes.map(quiz => (
                    <option key={quiz._id} value={quiz._id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="courseName" className="form-label">
                  <FaBook className="label-icon" />
                  Course Name *
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., React Development"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="scheduledDate" className="form-label">
                  <FaCalendarAlt className="label-icon" />
                  Date *
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="form-input"
                  min={today}
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="scheduledTime" className="form-label">
                  <FaClock className="label-icon" />
                  Time *
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                <FaClock className="label-icon" />
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="form-input"
                min="15"
                max="480"
                step="15"
                required
              />
              <small className="form-help">Minimum 15 minutes, maximum 480 minutes (8 hours)</small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FaFileAlt className="label-icon" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input form-textarea"
                rows="4"
                placeholder="Add meeting description, agenda, or any additional information..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Meeting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;

