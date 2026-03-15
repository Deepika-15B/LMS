import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './AdminQuizzes.css';

const AdminQuizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    level: 'beginner',
    timeLimit: 0,
    isActive: true,
    questions: [
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]
  });

  const [expandedQuiz, setExpandedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/quizzes/all', { withCredentials: true });
      setQuizzes(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (field === 'questionText') {
      updatedQuestions[index].questionText = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = parseInt(value);
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) return;
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const toggleQuizStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/quizzes/${id}`, 
        { isActive: !currentStatus }, 
        { withCredentials: true }
      );
      fetchQuizzes();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`/api/quizzes/${id}`, { withCredentials: true });
      fetchQuizzes();
    } catch (err) {
      alert('Failed to delete quiz');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'General',
      level: 'beginner',
      timeLimit: 0,
      isActive: true,
      questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    setIsEditing(false);
    setCurrentQuizId(null);
    setShowForm(false);
  };

  const editQuiz = (quiz) => {
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      level: quiz.level,
      timeLimit: quiz.timeLimit || 0,
      isActive: quiz.isActive,
      questions: quiz.questions.length ? quiz.questions.map(q => ({...q})) : [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    setCurrentQuizId(quiz._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.title || !formData.description) return alert('Title and description are required.');
      for (let i = 0; i < formData.questions.length; i++) {
        if (!formData.questions[i].questionText) return alert(`Question ${i + 1} text is required.`);
        if (formData.questions[i].options.some(opt => !opt.trim())) return alert(`All options in Question ${i + 1} must be filled.`);
      }

      if (isEditing) {
        await axios.put(`/api/quizzes/${currentQuizId}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/quizzes', formData, { withCredentials: true });
      }
      
      fetchQuizzes();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quiz');
    }
  };

  if (loading) return <div className="loading-spinner" style={{ margin: '5rem auto' }}></div>;

  return (
    <div className="admin-quizzes-page animate-fade-in py-3">
      <div className="container">
        <div className="flex-between align-center mb-3">
          <h2>Manage Quizzes</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Create New Quiz
            </button>
          )}
        </div>

        {error && <div className="error-message mb-2">{error}</div>}

        {showForm ? (
          <div className="quiz-form-card card glass-panel">
            <h3 className="mb-2">{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>Quiz Title</label>
                  <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group half-width">
                  <label>Category</label>
                  <input type="text" name="category" className="form-input" value={formData.category} onChange={handleInputChange} required />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-textarea" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>

              <div className="form-row">
                <div className="form-group third-width">
                  <label>Difficulty Level</label>
                  <select name="level" className="form-select" value={formData.level} onChange={handleInputChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group third-width">
                  <label>Time Limit (minutes)</label>
                  <input type="number" name="timeLimit" className="form-input" value={formData.timeLimit} onChange={handleInputChange} min="0" />
                  <small className="text-secondary text-sm">0 means no limit</small>
                </div>
                <div className="form-group third-width flex-center">
                  <label className="checkbox-label">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                    Active (Visible to students)
                  </label>
                </div>
              </div>

              <hr className="my-2" />
              <h4 className="mb-2">Questions</h4>

              <div className="questions-container">
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-block border-left pl-2 mb-2">
                    <div className="flex-between align-center mb-1">
                      <h5>Question {qIndex + 1}</h5>
                      {formData.questions.length > 1 && (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeQuestion(qIndex)}><FaTrash /></button>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <input type="text" className="form-input mb-1" placeholder="Enter question text here" 
                             value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} required />
                    </div>

                    <div className="options-grid">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="option-row">
                          <input type="radio" name={`correct_${qIndex}`} checked={q.correctAnswer === oIndex} 
                                 onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)} />
                          <input type="text" className="form-input option-input" placeholder={`Option ${oIndex + 1}`} 
                                 value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-3 mt-2">
                <button type="button" className="btn btn-outline btn-sm full-width" onClick={addQuestion}>
                  <FaPlus /> Add Another Question
                </button>
              </div>

              <div className="form-actions flex-end gap-1">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Quiz' : 'Create Quiz'}</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="quizzes-list">
            {quizzes.length === 0 ? (
              <div className="empty-state card text-center py-3 glass-panel">
                <p>No quizzes created yet.</p>
                <button className="btn btn-primary mt-1" onClick={() => setShowForm(true)}>Create One</button>
              </div>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz._id} className="card quiz-list-card glass-panel mb-2">
                  <div className="quiz-list-header flex-between cursor-pointer" onClick={() => setExpandedQuiz(expandedQuiz === quiz._id ? null : quiz._id)}>
                    <div className="quiz-list-title">
                      <h4 className="m-0 flex-row align-center gap-05">
                        {quiz.title} 
                        <span className={`status-badge ${quiz.isActive ? 'active' : 'inactive'}`}>
                          {quiz.isActive ? 'Active' : 'Draft'}
                        </span>
                      </h4>
                      <p className="text-sm text-secondary m-0 mt-05">
                        {quiz.questions.length} Questions • {quiz.category} • {quiz.level}
                      </p>
                    </div>
                    <div className="quiz-list-actions flex-row gap-1 align-center">
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); editQuiz(quiz); }} title="Edit"><FaEdit className="text-primary" /></button>
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); toggleQuizStatus(quiz._id, quiz.isActive); }} title={quiz.isActive ? 'Deactivate' : 'Activate'}>
                        {quiz.isActive ? <FaTimesCircle className="text-warning" /> : <FaCheckCircle className="text-success" />}
                      </button>
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz._id); }} title="Delete"><FaTrash className="text-danger" /></button>
                      {expandedQuiz === quiz._id ? <FaChevronUp className="text-secondary" /> : <FaChevronDown className="text-secondary" />}
                    </div>
                  </div>
                  
                  {expandedQuiz === quiz._id && (
                    <div className="quiz-list-details border-top mt-1 pt-1">
                      <p className="text-sm">{quiz.description}</p>
                      <div className="questions-preview">
                        <strong>Questions Preview:</strong>
                        <ul className="text-sm mt-05">
                          {quiz.questions.slice(0, 3).map((q, i) => (
                            <li key={i}>{q.questionText}</li>
                          ))}
                          {quiz.questions.length > 3 && <li><em>...and {quiz.questions.length - 3} more</em></li>}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizzes;
