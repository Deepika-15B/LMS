import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaVideo, FaUser, FaCalendarAlt, FaClock, FaPlus, FaEdit, FaTrash, FaEye, FaUsers } from 'react-icons/fa';
import moment from 'moment';
import './LiveClasses.css';

const AdminMeetings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/meetings/instructor');
      setMeetings(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch meetings');
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    
    try {
      await axios.delete(`/api/meetings/${meetingId}`);
      fetchMeetings();
    } catch (err) {
      console.error('Error deleting meeting:', err);
      alert('Failed to delete meeting');
    }
  };

  const getMeetingStatus = (meeting) => {
    const now = new Date();
    const scheduledDateTime = new Date(meeting.scheduledDate);
    const [hours, minutes] = meeting.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endTime = new Date(scheduledDateTime);
    endTime.setMinutes(endTime.getMinutes() + meeting.duration);

    if (now < scheduledDateTime) {
      return 'upcoming';
    } else if (now >= scheduledDateTime && now <= endTime) {
      return 'live';
    } else {
      return 'ended';
    }
  };

  const formatDateTime = (date, time) => {
    const scheduledDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return moment(scheduledDateTime).format('MMMM Do YYYY, h:mm A');
  };

  const handleViewMeeting = (meetingId, meetingUrl) => {
    const roomId = meetingUrl.split('/').pop();
    navigate(`/meeting/${roomId}?meetingId=${meetingId}`);
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <div className="live-classes-page animate-fade-in">
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1 className="page-title">
              <FaVideo className="title-icon" />
              Meeting Management
            </h1>
            <p className="page-subtitle">Manage all scheduled live classes and meetings</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/meetings/create')}
          >
            <FaPlus /> Schedule New Meeting
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Display existing meetings first */}
        {meetings.length > 0 && (
          <div className="meetings-list-section mb-3">
            <h3 className="section-title">Created Meetings</h3>
            <div className="meetings-grid">
              {meetings.map(meeting => {
                const status = getMeetingStatus(meeting);
                const isLive = status === 'live';
                const isUpcoming = status === 'upcoming';
                const isEnded = status === 'ended';
                
                return (
                  <div key={meeting._id} className={`meeting-card card glass-panel ${isLive ? 'live' : ''}`}>
                    {isLive && (
                      <div className="live-badge">
                        <span className="live-dot"></span>
                        LIVE NOW
                      </div>
                    )}
                    
                    <div className="meeting-header">
                      <h3 className="meeting-title">{meeting.title}</h3>
                      <span className={`status-badge ${status}`}>
                        {status === 'live' ? 'Live' : status === 'upcoming' ? 'Upcoming' : 'Ended'}
                      </span>
                    </div>

                    <div className="meeting-details">
                      <div className="detail-item">
                        <FaUser className="detail-icon" />
                        <span className="detail-label">Instructor:</span>
                        <span className="detail-value">{meeting.instructorName || user?.fullName || 'N/A'}</span>
                      </div>

                      <div className="detail-item">
                        <FaVideo className="detail-icon" />
                        <span className="detail-label">Course:</span>
                        <span className="detail-value">{meeting.courseName}</span>
                      </div>

                      <div className="detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        <span className="detail-label">Date & Time:</span>
                        <span className="detail-value">{formatDateTime(meeting.scheduledDate, meeting.scheduledTime)}</span>
                      </div>

                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{meeting.duration} minutes</span>
                      </div>

                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <span className="detail-label">Participants:</span>
                        <span className="detail-value">{meeting.enrolledStudents?.length || 0} enrolled</span>
                      </div>
                    </div>

                    {meeting.description && (
                      <div className="meeting-description">
                        <p>{meeting.description}</p>
                      </div>
                    )}

                    <div className="meeting-actions">
                      <div className="meeting-link-wrapper">
                        <span className="detail-label">Meeting Link:</span>
                        <a
                          href={meeting.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          title="Open Meeting Link"
                        >
                          <FaVideo /> {meeting.meetingUrl}
                        </a>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteMeeting(meeting._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Meeting"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state or create new meeting form */}
        {meetings.length === 0 ? (
          <div className="empty-state card glass-panel">
            <div className="empty-icon-wrapper">
              <FaVideo className="empty-icon" />
            </div>
            <h3>No Meetings Created</h3>
            <p>You haven't created any meetings yet.</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => navigate('/admin/meetings/create')}
            >
              <FaPlus /> Create First Meeting
            </button>
          </div>
        ) : (
          <div className="create-meeting-section mt-3">
            <button 
              className="btn btn-outline full-width"
              onClick={() => navigate('/admin/meetings/create')}
            >
              <FaPlus /> Schedule New Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMeetings;
