import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaQuestionCircle, FaClock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight, FaFlag } from 'react-icons/fa';
import './CourseQuiz.css';

const CourseQuiz = () => {
  const { courseId } = useParams(); // Using courseId as quizId from the old route structure
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); 
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !quizCompleted && !loading) {
      submitQuiz();
    }
  }, [timeLeft, quizCompleted, quiz, loading]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quizzes/${courseId}`, { withCredentials: true });
      const fetchedQuiz = res.data;
      
      setQuiz(fetchedQuiz);
      setQuestions(fetchedQuiz.questions || []);
      
      // Set time limit if provided, otherwise default to 60 mins
      const initialTime = fetchedQuiz.timeLimit ? fetchedQuiz.timeLimit * 60 : 3600;
      setTimeLeft(initialTime);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quiz');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    console.log(`Selecting answer for question ${currentQuestion}: option ${optionIndex}`);
    setAnswers(prev => {
      const newAnswers = { ...prev, [currentQuestion]: optionIndex };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      console.log('Submitting answers:', answers);
      setSubmitting(true);
      const res = await axios.post(`/api/quizzes/${courseId}/submit`, { answers }, { withCredentials: true });
      console.log('Submission result:', res.data);
      
      setScore(res.data.score);
      setTotalQuestions(res.data.totalQuestions);
      setResults(res.data.results);
      setQuizCompleted(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="quiz-container animate-fade-in">
        <div className="card text-center p-3 m-3">
            <h2 className="text-danger">Error Loading Quiz</h2>
            <p>{error || 'Quiz not found'}</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/student/quizzes')}>
                Back to Quizzes
            </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
     return (
      <div className="quiz-container animate-fade-in">
        <div className="card text-center p-3 m-3">
            <h2>No Questions Available</h2>
            <p>This quiz currently has no questions.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/student/quizzes')}>
                Back to Quizzes
            </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / totalQuestions) * 100;
    const isPassing = percentage >= 50; // Use a standard pass mark or one from generic quiz schema

    return (
      <div className="quiz-container animate-fade-in">
        <div className="quiz-result-card card">
          <div className="result-header">
            {isPassing ? (
              <FaCheckCircle className="result-icon success" />
            ) : (
              <FaTimesCircle className="result-icon fail" />
            )}
            <h2>Quiz Completed!</h2>
            <p className="subtitle">{quiz.title}</p>
          </div>
          
          <div className="score-circle">
            <div className="score-value">
              <span className="current">{score}</span>
              <span className="total">/ {totalQuestions}</span>
            </div>
            <div className="score-percentage">
              {percentage.toFixed(0)}%
            </div>
          </div>

          <div className="result-details">
            <p className="result-message">
              {isPassing 
                ? "Congratulations! You've passed the quiz." 
                : "Keep practicing! You need 50% to pass."}
            </p>
          </div>

          <div className="results-breakdown mt-2">
            <h3>Detailed Results</h3>
            {results.map((result, index) => (
              <div key={index} className={`result-item card ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-item-header flex-between">
                  <span className="question-label">Question {index + 1}</span>
                  {result.isCorrect ? (
                    <span className="status-success"><FaCheckCircle /> Correct</span>
                  ) : (
                    <span className="status-error"><FaTimesCircle /> Incorrect</span>
                  )}
                </div>
                <p className="result-question">{result.questionText}</p>
                <div className="result-answers">
                  <div className="answer-line">
                    <strong>Your Answer:</strong> <span>{questions[index]?.options[result.chosenAnswer] || 'Not answered'}</span>
                  </div>
                  {!result.isCorrect && (
                    <div className="answer-line">
                      <strong>Correct Answer:</strong> <span className="text-success">{questions[index]?.options[result.correctAnswer]}</span>
                    </div>
                  )}
                </div>
                {result.explanation && (
                  <div className="result-explanation mt-1">
                    <strong>Explanation:</strong> <p>{result.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button className="btn btn-outline" onClick={() => navigate('/student/quizzes')}>
              Return to Quizzes
            </button>
            <button className="btn btn-primary" onClick={() => {
              setQuizCompleted(false);
              setAnswers({});
              setCurrentQuestion(0);
              setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 3600);
            }}>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-header card glass-panel">
        <div className="quiz-info">
          <h2>{quiz.title}</h2>
          <p className="text-sm text-secondary">{quiz.category}</p>
        </div>
        <div className="quiz-meta">
          <div className="timer">
            <FaClock className={timeLeft < 300 ? 'text-danger' : ''} />
            <span className={timeLeft < 300 ? 'text-danger timer-pulse' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="progress">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="quiz-content card glass-panel">
        <div className="question-section">
          <div className="question-number">
            <FaQuestionCircle />
            <span>Question {currentQuestion + 1}</span>
          </div>
          <h3 className="question-text">{currentQ.questionText || currentQ.question}</h3>
        </div>

        <div className="options-section">
          {currentQ.options.map((option, index) => (
            <div 
              key={index}
              className={`option-card ${answers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="option-marker">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="option-text">{option}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-controls card glass-panel flex-between">
        <button 
          className="btn btn-outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <FaArrowLeft /> Previous
        </button>

        <div className="quiz-actions flex-end gap-1">
          {currentQuestion === questions.length - 1 ? (
            <button 
              className="btn btn-primary submit-btn"
              onClick={submitQuiz}
            >
              <FaCheckCircle /> Submit Quiz
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next <FaArrowRight />
            </button>
          )}
        </div>
      </div>

      <div className="question-navigator card glass-panel mt-3">
        <h4>Question Navigator</h4>
        <div className="navigator-grid">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`nav-bubble 
                ${index === currentQuestion ? 'current' : ''}
                ${answers[index] !== undefined ? 'answered' : ''}
              `}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;
