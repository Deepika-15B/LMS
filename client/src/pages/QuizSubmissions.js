import React, { useState, useEffect } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaBook, FaSearch } from 'react-icons/fa';
import './QuizSubmissions.css';

const QuizSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    status: 'all',
    attempt: 'all',
    search: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  const fetchSubmissions = async () => {
    try {
      // Mock data for quiz submissions - empty for now
      const mockSubmissions = [];

      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = submissions;

    if (filters.course !== 'all') {
      filtered = filtered.filter(sub => sub.courseId === filters.course);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    if (filters.attempt !== 'all') {
      filtered = filtered.filter(sub => sub.attemptNumber === parseInt(filters.attempt));
    }

    if (filters.search) {
      filtered = filtered.filter(sub => 
        sub.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.studentEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.courseName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <FaCheckCircle className="text-success" />;
      case 'failed':
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaClock className="text-warning" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const courses = [
    { id: '1', name: 'Programming in C' },
    { id: '2', name: 'Data Structures and Algorithms' },
    { id: '3', name: 'Database Management Systems' },
    { id: '4', name: 'Web Development with React' }
  ];

  if (loading) {
    return (
      <div className="quiz-submissions animate-fade-in">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-submissions animate-fade-in">
      <div className="container">
        <div className="page-header text-center mb-3">
          <h1 className="dashboard-title">Quiz Submissions</h1>
          <p className="text-secondary">Monitor and analyze student quiz performance</p>
        </div>

        <div className="filters-section card glass-panel">
          <div className="filter-group">
            <label htmlFor="course-filter" className="form-label text-secondary">Course</label>
            <select
              id="course-filter"
              className="form-control"
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter" className="form-label text-secondary">Status</label>
            <select
              id="status-filter"
              className="form-control"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="attempt-filter" className="form-label text-secondary">Attempt</label>
            <select
              id="attempt-filter"
              className="form-control"
              value={filters.attempt}
              onChange={(e) => handleFilterChange('attempt', e.target.value)}
            >
              <option value="all">All Attempts</option>
              <option value="1">1st Attempt</option>
              <option value="2">2nd Attempt</option>
              <option value="3">3rd Attempt</option>
            </select>
          </div>

          <div className="filter-group" style={{ flexGrow: 1 }}>
            <label htmlFor="search-filter" className="form-label text-secondary">Search</label>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon text-tertiary" />
              <input
                id="search-filter"
                className="form-control"
                type="text"
                placeholder="Search by name, email, or course..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="submissions-stats dashboard-grid">
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">Total Submissions</h3>
            <p className="stat-number text-xl font-weight-bold text-primary m-0">{filteredSubmissions.length}</p>
          </div>
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">Passed</h3>
            <p className="stat-number text-xl font-weight-bold text-success m-0">
              {filteredSubmissions.filter(s => s.status === 'passed').length}
            </p>
          </div>
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">Failed</h3>
            <p className="stat-number text-xl font-weight-bold text-danger m-0">
              {filteredSubmissions.filter(s => s.status === 'failed').length}
            </p>
          </div>
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">Average Score</h3>
            <p className="stat-number text-xl font-weight-bold text-info m-0">
              {filteredSubmissions.length > 0 
                ? Math.round(filteredSubmissions.reduce((sum, s) => sum + s.percentage, 0) / filteredSubmissions.length)
                : 0}%
            </p>
          </div>
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">First Attempts</h3>
            <p className="stat-number text-xl font-weight-bold text-primary m-0">
              {filteredSubmissions.filter(s => s.attemptNumber === 1).length}
            </p>
          </div>
          <div className="stat-card card glass-panel hover-lift text-center p-2">
            <h3 className="text-sm text-secondary text-uppercase tracking-wider mb-05">Retakes</h3>
            <p className="stat-number text-xl font-weight-bold text-warning m-0">
              {filteredSubmissions.filter(s => s.attemptNumber > 1).length}
            </p>
          </div>
        </div>

        <div className="submissions-table-container card glass-panel mt-3">
          <div className="table-responsive">
            <table className="submissions-table table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Attempt</th>
                  <th>Time Spent</th>
                  <th>Submitted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(submission => (
                  <tr key={submission.id}>
                    <td>
                      <div className="student-info flex-row align-center gap-1">
                        <FaUser className="student-icon text-primary" />
                        <div>
                          <div className="student-name font-weight-bold text-primary">{submission.studentName}</div>
                          <div className="student-email text-sm text-secondary">{submission.studentEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="course-info flex-row align-center gap-05">
                        <FaBook className="course-icon text-secondary" />
                        <span className="font-weight-medium">{submission.courseName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="score-info flex-column">
                        <span className="score font-weight-bold text-primary">{submission.score}/{submission.totalQuestions}</span>
                        <span className="percentage text-sm text-secondary">({submission.percentage}%)</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell flex-row align-center gap-05">
                        {getStatusIcon(submission.status)}
                        <span className={`status-text font-weight-bold text-sm text-uppercase ${submission.status === 'passed' ? 'text-success' : submission.status === 'failed' ? 'text-danger' : 'text-warning'}`}>{getStatusText(submission.status)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="attempt-info flex-row align-center gap-05">
                        <span className="attempt-number font-weight-bold">{submission.attemptNumber}</span>
                        <span className="attempt-max text-sm text-tertiary">/ {submission.maxAttempts}</span>
                      </div>
                    </td>
                    <td>
                      <div className="time-info flex-row align-center gap-05 text-secondary">
                        <FaClock className="time-icon text-primary" />
                        <span>{formatTime(submission.timeSpent)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info text-sm text-secondary">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                        <br />
                        <small className="text-tertiary">{new Date(submission.submittedAt).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm btn-icon" title="View Details">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="no-submissions p-3 text-center text-secondary">
              <div className="empty-state-icon text-4xl mb-1 text-tertiary">
                <FaBook />
              </div>
              <p>No submissions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissions;
