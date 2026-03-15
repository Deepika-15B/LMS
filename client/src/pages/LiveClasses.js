import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaVideo, FaUser, FaCalendarAlt, FaClock, FaPlay, FaSpinner, FaBook } from 'react-icons/fa';
import moment from 'moment';
import './LiveClasses.css';

const LiveClasses = () => {
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
      const res = await axios.get('/api/meetings/student');
      setMeetings(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch live classes');
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Students will join directly via the Jitsi meeting link now,
  // so we no longer navigate through an internal meeting page.

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

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
        <p>Loading live classes...</p>
      </div>
    );
  }

  return (
    <div className="live-classes-page animate-fade-in">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FaVideo className="title-icon" />
            Live Classes
          </h1>
          <p className="page-subtitle">Join scheduled live online classes</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {meetings.length === 0 ? (
          <div className="empty-state card glass-panel">
            <div className="empty-icon-wrapper">
              <FaVideo className="empty-icon" />
            </div>
            <h3>No Live Classes Available</h3>
            <p>There are no upcoming live classes scheduled at the moment.</p>
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map(meeting => {
              const status = getMeetingStatus(meeting);
              const isLive = status === 'live';
              const isUpcoming = status === 'upcoming';
              
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
                      <span className="detail-value">{meeting.instructorName || meeting.instructor?.fullName || 'N/A'}</span>
                    </div>

                    <div className="detail-item">
                      <FaBook className="detail-icon" />
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
                  </div>

                  {meeting.description && (
                    <div className="meeting-description">
                      <p>{meeting.description}</p>
                    </div>
                  )}

                  <div className="meeting-actions">
                    {(isLive || isUpcoming) && (
                      <div className="meeting-link-wrapper">
                        <span className="detail-label">Meeting Link:</span>
                        <a
                          href={meeting.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <FaPlay className="btn-icon" />
                          {meeting.meetingUrl}
                        </a>
                      </div>
                    )}
                    {status === 'ended' && (
                      <button className="btn btn-outline" disabled>
                        Meeting Ended
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;

