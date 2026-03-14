import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaUsers, FaStar, FaPlay, FaCheckCircle, FaClock } from 'react-icons/fa';

import './StudentCourses.css';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Real courses similar to SWAYAM NPTEL
      const realCourses = [
        {
          _id: '1',
          title: 'Programming in C',
          description: 'Learn the fundamentals of C programming language including data types, control structures, functions, arrays, pointers, and file handling.',
          instructor: 'Prof. Rajesh Kumar, IIT Delhi',
          progress: 68,
          status: 'enrolled',
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          totalLessons: 8,
          completedLessons: 5,
          duration: '12 weeks',
          level: 'Beginner',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-10',
          lastAccessed: '2024-02-20',
          nextDeadline: '2024-03-01',
          videoHours: 24,
          assignments: 6,
          completedAssignments: 4,
          totalMCQs: 25,
          completedMCQs: 17,
          mcqScore: 68,
          passPercentage: 50,
          hasQuiz: true
        },
        {
          _id: '2',
          title: 'Data Structures and Algorithms',
          description: 'Master fundamental data structures like arrays, linked lists, stacks, queues, trees, graphs and their algorithms with complexity analysis.',
          instructor: 'Dr. Priya Sharma, IIT Bombay',
          progress: 45,
          status: 'enrolled',
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          totalLessons: 12,
          completedLessons: 5,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-25',
          lastAccessed: '2024-02-18',
          nextDeadline: '2024-02-28',
          videoHours: 30,
          assignments: 8,
          completedAssignments: 3,
          totalMCQs: 25,
          completedMCQs: 11,
          mcqScore: 44,
          passPercentage: 50,
          hasQuiz: true
        },
        {
          _id: '3',
          title: 'Database Management Systems',
          description: 'Comprehensive study of database concepts, SQL queries, normalization, indexing, transactions, and database design principles.',
          instructor: 'Dr. Sunita Patel, IIT Madras',
          progress: 100,
          status: 'completed',
          startDate: '2024-01-20',
          endDate: '2024-04-20',
          totalLessons: 10,
          completedLessons: 10,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-15',
          lastAccessed: '2024-02-19',
          nextDeadline: '2024-02-25',
          videoHours: 27,
          assignments: 7,
          completedAssignments: 7,
          totalMCQs: 25,
          completedMCQs: 25,
          mcqScore: 88,
          passPercentage: 50,
          hasQuiz: true,
          quizPassed: true,
          grade: 'A'
        },
        {
          _id: '4',
          title: 'Web Development with React',
          description: 'Modern web development using React.js, including hooks, state management, routing, component lifecycle, and deployment strategies.',
          instructor: 'Prof. Vikram Singh, IIT Roorkee',
          progress: 30,
          status: 'enrolled',
          startDate: '2024-02-15',
          endDate: '2024-05-15',
          totalLessons: 14,
          completedLessons: 4,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Web Development',
          credits: 3,
          enrollmentDate: '2024-02-10',
          lastAccessed: '2024-02-17',
          nextDeadline: '2024-02-29',
          videoHours: 33,
          assignments: 9,
          completedAssignments: 2,
          totalMCQs: 25,
          completedMCQs: 8,
          mcqScore: 32,
          passPercentage: 50,
          hasQuiz: true
        }
      ];
      
      setCourses(realCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return course.status === 'enrolled';
    if (filter === 'completed') return course.status === 'completed';
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
              My Learning
            </h1>
            <p className="dashboard-subtitle">
              Continue your educational journey and track your progress
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
                <h3>{courses.length}</h3>
                <p>Total Courses</p>
              </div>
            </div>
            <div className="summary-stat">
              <div className="stat-icon-wrapper emerald">
                <FaPlay />
              </div>
              <div className="stat-info">
                <h3>{courses.filter(c => c.status === 'enrolled').length}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="summary-stat">
              <div className="stat-icon-wrapper purple">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <h3>{courses.filter(c => c.status === 'completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="courses-filters mb-3">
          <button 
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          <button 
            className={`filter-pill ${filter === 'enrolled' ? 'active' : ''}`}
            onClick={() => setFilter('enrolled')}
          >
            In Progress
          </button>
          <button 
            className={`filter-pill ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course._id} className="card course-card glass-panel flex-column h-100">
                <div className="course-card-body flex-grow">
                  <div className="course-header-top">
                    <span className={`status-badge ${course.status}`}>
                      {course.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    <span className="course-category-tag">{course.category}</span>
                  </div>

                  <h3 className="course-title line-clamp-2">{course.title}</h3>
                  <p className="course-instructor"><FaUsers className="instructor-icon"/> {course.instructor}</p>
                  
                  <p className="course-description line-clamp-3">{course.description}</p>
                  
                  <div className="course-progress-section mt-auto">
                    <div className="progress-info">
                       <span className="progress-label">Progress</span>
                       <span className="progress-value">{course.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  
                  {course.status === 'completed' && course.grade && (
                    <div className="grade-display mt-2">
                       <FaStar className="grade-icon" />
                       <span className="grade-text">Final Grade: <strong>{course.grade}</strong></span>
                    </div>
                  )}

                  <div className="course-meta mt-2 pt-2 border-top">
                    <div className="meta-item" title="Duration">
                      <FaClock /> {course.duration}
                    </div>
                    <div className="meta-item" title="Quizzes">
                       <FaBook /> {course.completedMCQs}/{course.totalMCQs} MCQs
                    </div>
                  </div>
                </div>

                <div className="course-card-footer mt-auto">
                  {course.hasQuiz && (
                    <Link to={`/courses/${course._id}/quiz`} className={`btn ${course.progress === 100 ? 'btn-outline' : 'btn-primary'} full-width`}>
                      {course.completedMCQs === course.totalMCQs || course.progress === 100 ? 'Review Material' : 'Resume Learning'}
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state card full-width">
              <div className="empty-icon-wrapper">
                 <FaGraduationCap className="empty-icon" />
              </div>
              <h3>No courses found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't enrolled in any courses yet. Start your journey today!"
                  : `No ${filter} courses found.`
                }
              </p>
              <Link to="/" className="btn btn-primary mt-2">
                Browse Available Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
