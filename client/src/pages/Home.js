import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGraduationCap, FaUsers, FaBook, FaComments, FaChartLine, FaRocket, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotes: 0,
    totalCourses: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user) {
          const [notesResponse, usersResponse, quizzesResponse] = await Promise.all([
            axios.get('/api/notes'),
            user?.role === 'admin' 
              ? axios.get('/api/users/stats/overview')
              : axios.get('/api/users/stats/basic'),
            axios.get('/api/quizzes')
          ]);

          const notes = notesResponse.data;
          const recentNotes = notes.slice(0, 6);

          setStats({
            totalUsers: usersResponse?.data?.totalUsers || 0,
            totalNotes: notes.length,
            totalQuizzes: quizzesResponse?.data?.length || 0, 
            recentNotes
          });
        } else {
          const [notesResponse, usersResponse, quizzesResponse] = await Promise.all([
            axios.get('/api/notes/stats/public'),
            axios.get('/api/users/stats/public'),
            axios.get('/api/quizzes') // Fallback fetch
          ]);

          setStats({
            totalUsers: usersResponse?.data?.totalUsers || 0,
            totalNotes: notesResponse?.data?.totalNotes || 0,
            totalQuizzes: quizzesResponse?.data?.length || 0, 
            recentNotes: []
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const features = [
    {
      icon: <FaBook />,
      title: 'Interactive Learning',
      description: 'Create, share, and collaborate on educational content with rich text capabilities.'
    },
    {
      icon: <FaComments />,
      title: 'Real-time Discussions',
      description: 'Engage in lively discussions and receive immediate feedback on your coursework.'
    },
    {
      icon: <FaUsers />,
      title: 'Adaptive Access',
      description: 'Tailored experiences whether you are an educator, student, or administrator.'
    },
    {
      icon: <FaChartLine />,
      title: 'Analytics Edge',
      description: 'Monitor your academic progress dynamically with integrated analytics.'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home animate-fade-in">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Elevate Your <span className="text-gradient">Learning</span> Experience
            </h1>
            <p className="hero-subtitle">
              A premium space designed for seamless creation, sharing, and collaboration in education.
            </p>
            {!user ? (
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary btn-large cta-btn">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn btn-outline btn-large secondary-btn">
                  Access Account
                </Link>
              </div>
            ) : (
              <div className="hero-buttons">
                <Link to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} className="btn btn-primary btn-large cta-btn">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
          <div className="hero-visual">
            <div className="glass-panel visual-card">
               <FaGraduationCap className="visual-icon" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Platform Impact</h2>
            <p className="section-subtitle">Join thousands growing together on LEARNIT.</p>
          </div>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-icon-wrapper users"><FaUsers /></div>
              <h3>{stats.totalUsers}+</h3>
              <p>Active Users</p>
            </div>
            <div className="card stat-card">
              <div className="stat-icon-wrapper notes"><FaBook /></div>
              <h3>{stats.totalNotes}+</h3>
              <p>Resources Shared</p>
            </div>
            <div className="card stat-card">
              <div className="stat-icon-wrapper courses"><FaGraduationCap /></div>
              <h3>{stats.totalQuizzes || 0}+</h3>
              <p>Active Quizzes</p>
            </div>
            <div className="card stat-card">
              <div className="stat-icon-wrapper community"><FaComments /></div>
              <h3>24/7</h3>
              <p>Community Access</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="card feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {stats.recentNotes.length > 0 && (
        <section className="recent-notes-section">
          <div className="container">
            <div className="section-header split">
              <h2 className="section-title">Fresh Materials</h2>
              {user && (
                <Link to="/notes" className="btn btn-outline">
                  Browse Catalog
                </Link>
              )}
            </div>
            <div className="notes-grid">
              {stats.recentNotes.map((note) => (
                <div key={note._id} className="card note-card">
                  <div className="note-content-wrapper">
                    <h3 className="note-title">{note.title}</h3>
                    <p className="note-excerpt">
                      {note.content.substring(0, 120).replace(/<[^>]*>?/gm, '')}...
                    </p>
                  </div>
                  <div className="note-footer">
                    <div className="note-meta">
                      <FaUser className="meta-icon"/>
                      <span>{note.author?.fullName || 'Anonymous'}</span>
                    </div>
                    {user && (
                      <Link to={`/notes/${note._id}`} className="read-more-link">
                        Read →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="container">
          <div className="glass-panel cta-panel">
            <h2>Transform Your Education Today</h2>
            <p>Experience learning without boundaries starting now.</p>
            {!user ? (
              <Link to="/register" className="btn btn-primary btn-large">
                <FaRocket /> Initialize Journey
              </Link>
            ) : (
              <Link to="/student/quizzes" className="btn btn-primary btn-large">
                <FaBook /> Explore Quizzes
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
