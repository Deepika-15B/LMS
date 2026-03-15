import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      // Fetch student-specific data
      const notesResponse = await axios.get('/api/notes');
      const notes = notesResponse.data || [];

      setStats({
        recentNotes: notes.slice(0, 4)
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
