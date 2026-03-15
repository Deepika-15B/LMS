import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine, FaUser, FaVideo, FaCalendarAlt, FaClock, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    recentNotes: [],
    upcomingMeetings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      // Fetch student-specific data
      const [notesResponse, meetingsResponse] = await Promise.all([
        axios.get('/api/notes'),
        axios.get('/api/meetings/student').catch((err) => {
          console.error('Error fetching meetings:', err);
          return { data: [] };
        })
      ]);
      
      const notes = notesResponse.data || [];
      let meetings = meetingsResponse.data || [];

      // Filter to show only upcoming meetings (not past ones)
      const now = new Date();
      meetings = meetings.filter(meeting => {
        try {
          if (!meeting.scheduledDate) return false;
          
          // scheduledDate already contains the full datetime
          let scheduledDateTime = new Date(meeting.scheduledDate);
          
          // If time component is missing, combine with scheduledTime
          if (meeting.scheduledTime && (scheduledDateTime.getHours() === 0 && scheduledDateTime.getMinutes() === 0)) {
            const [hours, minutes] = meeting.scheduledTime.split(':');
            scheduledDateTime.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
          }
          
          // Show if meeting is upcoming or currently live
          const endTime = new Date(scheduledDateTime.getTime() + (meeting.duration || 60) * 60000);
          const isUpcoming = scheduledDateTime > now;
          const isLive = now >= scheduledDateTime && now <= endTime;
          
          return isUpcoming || isLive;
        } catch (err) {
          console.error('Error filtering meeting:', err, meeting);
          return false;
        }
      });

      console.log('Fetched meetings:', meetings); // Debug log

      setStats({
        recentNotes: notes.slice(0, 4),
        upcomingMeetings: meetings.slice(0, 3) // Show up to 3 upcoming meetings
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
      setStats({
        recentNotes: [],
        upcomingMeetings: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-dashboard animate-fade-in">
      <div className="container" style={{ padding: '0' }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <FaChartLine className="title-icon" />
            Student Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back to your learning portal
          </p>
        </div>


        <div className="dashboard-content">
          <div className="dashboard-section main-section">
            <div className="section-header split">
              <h2 className="section-title">
                <FaBook className="section-icon text-gradient" />
                Recent Notes
              </h2>
              <Link to="/notes" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>
            
            <div className="notes-list">
              {stats.recentNotes.length > 0 ? (
                stats.recentNotes.map(note => (
                  <div key={note._id} className="card note-list-card">
                    <div className="note-list-content">
                      <h3 className="note-title">{note.title}</h3>
                      <p className="note-excerpt">
                        {note.content.substring(0, 100).replace(/<[^>]*>?/gm, '')}...
                      </p>
                    </div>
                    <div className="note-list-actions">
                      <span className="note-date">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <Link to={`/notes/${note._id}`} className="btn btn-primary btn-sm">
                        Read Book
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state card">
                  <div className="empty-icon-wrapper">
                    <FaBook className="empty-icon text-gradient" />
                  </div>
                  <h3>No notes available yet</h3>
                  <p>Start exploring quizzes to test your knowledge.</p>
                  <Link to="/student/quizzes" className="btn btn-primary">
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>

            {/* Live Classes Section - Always visible */}
            <div className="dashboard-section main-section" style={{ marginTop: '2rem' }}>
              <div className="section-header split">
                <h2 className="section-title">
                  <FaVideo className="section-icon text-gradient" />
                  Upcoming Live Classes
                </h2>
                <Link to="/student/live-classes" className="btn btn-outline btn-sm">
                  View All
                </Link>
              </div>
              
              <div className="notes-list">
                {stats.upcomingMeetings && stats.upcomingMeetings.length > 0 ? (
                  stats.upcomingMeetings.map(meeting => {
                    try {
                      // Handle date parsing - scheduledDate may already have time component
                      let scheduledDateTime = new Date(meeting.scheduledDate);
                      
                      // If time component is missing or zero, use scheduledTime
                      if (meeting.scheduledTime && (scheduledDateTime.getHours() === 0 && scheduledDateTime.getMinutes() === 0)) {
                        const [hours, minutes] = meeting.scheduledTime.split(':');
                        scheduledDateTime.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
                      }
                      
                      const now = new Date();
                      const endTime = new Date(scheduledDateTime.getTime() + (meeting.duration || 60) * 60000);
                      const isLive = now >= scheduledDateTime && now <= endTime;
                      const isUpcoming = now < scheduledDateTime;

                    return (
                      <div key={meeting._id} className={`card note-list-card ${isLive ? 'live-meeting-card' : ''}`}>
                        <div className="note-list-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <h3 className="note-title">{meeting.title}</h3>
                            {isLive && (
                              <span style={{ 
                                background: '#ef4444', 
                                color: 'white', 
                                padding: '0.2rem 0.6rem', 
                                borderRadius: '12px', 
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                LIVE
                              </span>
                            )}
                          </div>
                          <p className="note-excerpt" style={{ marginBottom: '0.5rem' }}>
                            <FaUser style={{ marginRight: '0.5rem', fontSize: '0.85rem' }} />
                            {meeting.instructorName || meeting.instructor?.fullName || 'Instructor'}
                          </p>
                          <p className="note-excerpt" style={{ marginBottom: '0.5rem' }}>
                            <FaCalendarAlt style={{ marginRight: '0.5rem', fontSize: '0.85rem' }} />
                            {moment(scheduledDateTime).format('MMMM Do YYYY, h:mm A')}
                          </p>
                          <p className="note-excerpt">
                            <FaClock style={{ marginRight: '0.5rem', fontSize: '0.85rem' }} />
                            Duration: {meeting.duration} minutes
                          </p>
                        </div>
                        <div className="note-list-actions">
                          {(isLive || isUpcoming) && (
                            <div className="meeting-link-wrapper">
                              <span className="detail-label" style={{ marginRight: '0.5rem', fontSize: '0.85rem' }}>
                                Meeting Link:
                              </span>
                              <a
                                href={meeting.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm"
                                style={isLive ? { borderColor: '#ef4444', color: '#ef4444' } : {}}
                              >
                                <FaPlay style={{ marginRight: '0.25rem' }} />
                                {meeting.meetingUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                    } catch (err) {
                      console.error('Error rendering meeting:', err, meeting);
                      return null;
                    }
                  }).filter(Boolean)
                ) : (
                  <div className="empty-state card">
                    <div className="empty-icon-wrapper">
                      <FaVideo className="empty-icon text-gradient" />
                    </div>
                    <h3>No upcoming live classes</h3>
                    <p>Check back later for scheduled meetings.</p>
                    <Link to="/student/live-classes" className="btn btn-primary">
                      View All Classes
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="dashboard-section card glass-panel quick-actions-panel">
              <div className="section-header">
                <h2 className="section-title">
                  <FaTasks className="section-icon" />
                  Quick Actions
                </h2>
              </div>
              
              <div className="quick-actions-list">
                <Link to="/notes" className="action-item">
                  <div className="action-icon-wrapper blue">
                    <FaBook />
                  </div>
                  <div className="action-content">
                    <h3>Browse Notes</h3>
                    <p>Access study materials</p>
                  </div>
                </Link>
                
                <Link to="/assignments" className="action-item">
                  <div className="action-icon-wrapper purple">
                    <FaTasks />
                  </div>
                  <div className="action-content">
                    <h3>Assignments</h3>
                    <p>Check your progress</p>
                  </div>
                </Link>
                
                <Link to="/profile" className="action-item">
                  <div className="action-icon-wrapper green">
                    <FaUser />
                  </div>
                  <div className="action-content">
                    <h3>Your Profile</h3>
                    <p>Manage settings</p>
                  </div>
                </Link>
                
                <Link to="/student/live-classes" className="action-item">
                  <div className="action-icon-wrapper red">
                    <FaVideo />
                  </div>
                  <div className="action-content">
                    <h3>Live Classes</h3>
                    <p>Join online meetings</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
