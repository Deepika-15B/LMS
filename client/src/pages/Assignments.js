import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendar, FaFileAlt, FaUpload, FaCheck, FaTimes, FaEye, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './Assignments.css';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    file: null,
    url: '',
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSubmissionData(prev => ({ ...prev, file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    try {
      setSubmitting(true);
      
      console.log('Submitting assignment:', {
        assignmentId: selectedAssignment._id,
        fileType: selectedAssignment.fileType,
        hasFile: !!submissionData.file,
        fileName: submissionData.file?.name,
        comments: submissionData.comments
      });
      
      const formData = new FormData();
      formData.append('comments', submissionData.comments);

      if (selectedAssignment.fileType === 'url') {
        formData.append('url', submissionData.url);
      } else if (submissionData.file) {
        formData.append('file', submissionData.file);
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`/api/assignments/${selectedAssignment._id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Submission response:', response.data);

      setSubmissionData({ file: null, url: '', comments: '' });
      setShowSubmissionForm(false);
      setSelectedAssignment(null);
      fetchAssignments();
      
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileTypeLabel = (fileType) => {
    const labels = {
      'image': 'Image Files',
      'video': 'Video Files',
      'pdf': 'PDF Files',
      'url': 'URL Link',
      'document': 'Document Files',
      'any': 'Any File Type'
    };
    return labels[fileType] || fileType;
  };

  const hasSubmitted = (assignment) => {
    return assignment.submissions?.some(sub => sub.student._id === user._id);
  };

  const getSubmission = (assignment) => {
    return assignment.submissions?.find(sub => sub.student._id === user._id);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="assignments-page animate-fade-in">
      <div className="container">
        <div className="app-header mb-3 text-center">
          <h1 className="dashboard-title justify-center">
            <FaFileAlt className="text-gradient" /> My Assignments
          </h1>
          <p className="dashboard-subtitle">Complete your assigned tasks and submit your work</p>
        </div>

        <div className="assignments-grid">
          {assignments.length > 0 ? assignments.map((assignment) => {
            const submitted = hasSubmitted(assignment);
            const submission = getSubmission(assignment);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <div key={assignment._id} className="card assignment-card glass-panel flex-column h-100">
                <div className="assignment-card-body flex-grow">
                  <div className="assignment-header-top flex-between mb-1 pt-1">
                    <div className="assignment-status">
                      {submitted ? (
                        <span className="status-pill active font-weight-bold">
                          <FaCheck /> Submitted
                        </span>
                      ) : overdue ? (
                        <span className="status overdue">
                          <FaTimes /> Overdue
                        </span>
                      ) : (
                        <span className="due-date-badge bg-surface text-primary">
                          <FaEye /> Active
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="assignment-title">{assignment.title}</h3>
                  <p className="assignment-desc line-clamp-3 mb-2">{assignment.description}</p>
                  
                  <div className="assignment-meta-grid pt-2 border-top">
                     <div className="meta-info-item">
                       <span className="meta-label">Type</span>
                       <span className="meta-value"><FaFileAlt /> {getFileTypeLabel(assignment.fileType)}</span>
                     </div>
                     <div className="meta-info-item text-right">
                       <span className="meta-label">Deadline</span>
                       <span className={`meta-value ${overdue && !submitted ? 'text-danger font-weight-bold' : ''}`}><FaCalendar /> {formatDate(assignment.dueDate)}</span>
                     </div>
                  </div>
                  
                  {(!submitted) && (
                     <div className="assignment-requirements mt-2 pt-2 border-top">
                       {assignment.allowedExtensions?.length > 0 && (
                         <div className="file-req-item text-sm text-secondary block mb-05">
                           <strong>Allowed file types:</strong> <span className="text-primary">{assignment.allowedExtensions.join(', ')}</span>
                         </div>
                       )}
                       {assignment.maxFileSize && (
                         <div className="file-req-item text-sm text-secondary block">
                           <strong>Max file size:</strong> {assignment.maxFileSize} MB
                         </div>
                       )}
                     </div>
                  )}
                </div>

                <div className="assignment-card-footer mt-auto border-top p-2 bg-surface flex-end">
                  {submitted ? (
                     <div className="flex-between full-width">
                        <span className="text-sm text-secondary font-weight-bold">Completed {formatDate(submission.submittedAt)}</span>
                        <a 
                          href={submission.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          View Work
                        </a>
                     </div>
                  ) : (
                    <button
                      className={`btn full-width justify-center ${overdue ? 'btn-outline border-danger text-danger' : 'btn-primary'}`}
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowSubmissionForm(true);
                      }}
                      disabled={overdue}
                    >
                      <FaUpload />
                      {overdue ? 'Assignment Overdue' : 'Submit Assignment'}
                    </button>
                  )}
                </div>
              </div>
            );
          }) : (
             <div className="empty-state card full-width">
                 <div className="empty-icon-wrapper mb-2">
                   <FaFileAlt className="empty-icon" />
                 </div>
                 <h3>No Assignments Found</h3>
                 <p>You have no active assignments right now. Enjoy your free time!</p>
              </div>
          )}
        </div>

        {/* Submission Modal Window */}
        {showSubmissionForm && selectedAssignment && (
          <div className="modal-overlay animate-fade-in" onClick={() => setShowSubmissionForm(false)}>
            <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit Assignment</h3>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body custom-scrollbar">
                
                <div className="bg-surface p-2 rounded mb-3">
                   <h4 className="text-primary font-weight-bold mb-1">{selectedAssignment.title}</h4>
                   <p className="text-sm text-secondary mb-2">{selectedAssignment.description}</p>
                   <div className="assignment-requirements text-sm pt-2 border-top border-darken flex-between">
                     <span className="font-weight-bold"><FaFileAlt className="text-primary" /> {getFileTypeLabel(selectedAssignment.fileType)}</span>
                     {selectedAssignment.maxFileSize && (
                       <span><strong>Max Size:</strong> {selectedAssignment.maxFileSize} MB</span>
                     )}
                     {selectedAssignment.allowedExtensions?.length > 0 && (
                       <span><strong>Ext:</strong> {selectedAssignment.allowedExtensions.join(', ')}</span>
                     )}
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                  {selectedAssignment.fileType === 'url' ? (
                    <div className="form-group mb-2">
                      <label htmlFor="url" className="form-label">Submission Link <span className="text-danger">*</span></label>
                      <input
                        type="url"
                        id="url"
                        name="url"
                        value={submissionData.url}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="https://your-work-link.com"
                      />
                    </div>
                  ) : (
                    <div className="form-group mb-2">
                       <label htmlFor="file" className="form-label">Upload File <span className="text-danger">*</span></label>
                       <div className="file-input-wrapper custom-file-input">
                         <input
                           type="file"
                           id="file"
                           name="file"
                           onChange={handleFileChange}
                           required
                           className="file-input"
                           accept={selectedAssignment.allowedExtensions?.length > 0 
                             ? selectedAssignment.allowedExtensions.join(',') 
                             : undefined}
                         />
                         <div className="file-input-display">
                           <span className="file-name text-primary font-weight-bold">{submissionData.file ? submissionData.file.name : 'Choose file...'}</span>
                           <span className="btn btn-outline btn-sm">Browse</span>
                         </div>
                       </div>
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label htmlFor="comments" className="form-label">Notes for Educator (Optional)</label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={submissionData.comments}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Add reflections, special instructions, or context about your submission..."
                    />
                  </div>

                  <div className="form-actions flex-end pt-2 border-top">
                    <button 
                      type="button" 
                      className="btn btn-outline mr-1" 
                      onClick={() => setShowSubmissionForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting || (!submissionData.file && !submissionData.url)}
                    >
                      {submitting ? 'Submitting...' : 'Confirm Submission'} <FaChevronRight className="ml-05" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
