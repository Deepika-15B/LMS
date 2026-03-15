import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaUsers, FaStar, FaPlay, FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './StudentQuizzes.css';

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/api/quizzes', { withCredentials: true });
      // Map the generic quiz data to frontend requirements format
      const formattedQuizzes = res.data.map(q => ({
        ...q,
        instructor: q.createdBy?.fullName || q.createdBy?.username || 'Admin',
        totalMCQs: q.questions?.length || 0,
        // Mocking progress for now since there's no completion tracking on backend
        status: 'enrolled',
        progress: 0,
        completedMCQs: 0
      }));
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return quiz.status === 'enrolled';
    if (filter === 'completed') return quiz.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-courses animate-fade-in">
      <div className="container">
        <div className="courses-header flex-between mb-3 text-center">
          <div>
            <h1 className="dashboard-title justify-center">
              <FaGraduationCap className="text-gradient" />
              Available Quizzes
            </h1>
            <p className="dashboard-subtitle">
              Test your knowledge with these dynamic quizzes!
            </p>
          </div>
        </div>

        <div className="courses-summary-wrapper mb-3">
          <div className="card courses-summary-card glass-panel">
            <div className="summary-stat">
              <div className="stat-icon-wrapper blue">
                <FaBook />
              </div>
              <div className="stat-info">
                <h3>{quizzes.length}</h3>
                <p>Available Quizzes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="courses-grid">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => (
              <div key={quiz._id} className="card course-card glass-panel flex-column h-100">
                <div className="course-card-body flex-grow">
                  <div className="course-header-top">
                    <span className="course-category-tag">{quiz.category}</span>
                    <span className="status-badge active">{quiz.level}</span>
                  </div>

                  <h3 className="course-title line-clamp-2">{quiz.title}</h3>
                  <p className="course-instructor"><FaUsers className="instructor-icon"/> Created by {quiz.instructor}</p>
                  
                  <p className="course-description line-clamp-3">{quiz.description}</p>
                  
                  <div className="course-meta mt-2 pt-2 border-top">
                    <div className="meta-item" title="Time Limit">
                      <FaClock /> {quiz.timeLimit > 0 ? `${quiz.timeLimit} mins` : 'No Time Limit'}
                    </div>
                    <div className="meta-item" title="Questions">
                       <FaBook /> {quiz.totalMCQs} Questions
                    </div>
                  </div>
                </div>

                <div className="course-card-footer mt-auto">
                    <Link to={`/quizzes/${quiz._id}/take`} className="btn btn-primary full-width">
                      Start Quiz
                    </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state card full-width p-3">
              <div className="empty-icon-wrapper mb-2">
                 <FaGraduationCap className="empty-icon text-secondary" style={{fontSize: '3rem'}} />
              </div>
              <h3>No quizzes available</h3>
              <p className="text-secondary">
                 Your instructors haven't published any quizzes yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuizzes;
