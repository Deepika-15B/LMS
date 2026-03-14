import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaCalendar, FaFileAlt, FaCheckCircle, FaTimesCircle, FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';
import './AdminAssignments.css';

const AdminAssignments = () => {
  useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: 'any',
    dueDate: '',
    maxFileSize: 10,
    allowedExtensions: '',
    isActive: true
  });

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAssignment) {
        await axios.put(`/api/assignments/${editingAssignment._id}`, formData);
      } else {
        await axios.post('/api/assignments', formData);
      }
      
      setShowForm(false);
      setEditingAssignment(null);
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert(error.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      fileType: assignment.fileType,
      dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
      maxFileSize: assignment.maxFileSize,
      allowedExtensions: assignment.allowedExtensions.join(', '),
      isActive: assignment.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await axios.delete(`/api/assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fileType: 'any',
      dueDate: '',
      maxFileSize: 10,
      allowedExtensions: '',
      isActive: true
    });
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

  const isImageFile = (fileName) => {
    if(!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-assignments-page animate-fade-in">
      <div className="container">
        
        {/* Page Header */}
        <div className="admin-header flex-between mb-3 text-center">
           <div>
             <h1 className="dashboard-title justify-center">
                <FaFileAlt className="text-gradient" /> Assignment Management
             </h1>
             <p className="dashboard-subtitle">Create and manage student assignments</p>
           </div>
           {!showForm && (
             <button 
               className="btn btn-primary"
               onClick={() => {
                 setShowForm(true);
                 setEditingAssignment(null);
                 resetForm();
               }}
             >
               <FaPlus /> Create Assignment
             </button>
           )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card glass-panel assignment-form-card animate-fade-in mb-3">
            <div className="form-header flex-between mb-2 pb-2 border-bottom">
              <h3>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>
                 <FaChevronLeft /> Back to List
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group mb-2">
                  <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="e.g. Final Project Submission"
                  />
                </div>
                
                <div className="form-group mb-2">
                  <label htmlFor="fileType" className="form-label">Submission Type <span className="text-danger">*</span></label>
                  <select
                    id="fileType"
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="any">Any File Type</option>
                    <option value="image">Image Files</option>
                    <option value="video">Video Files</option>
                    <option value="pdf">PDF Files</option>
                    <option value="document">Document Files</option>
                    <option value="url">URL Link</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group mb-2">
                  <label htmlFor="dueDate" className="form-label">Due Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group mb-2">
                  <label htmlFor="maxFileSize" className="form-label">Max File Size (MB)</label>
                  <input
                    type="number"
                    id="maxFileSize"
                    name="maxFileSize"
                    value={formData.maxFileSize}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-2">
                <label htmlFor="allowedExtensions" className="form-label">Allowed Extensions</label>
                <input
                  type="text"
                  id="allowedExtensions"
                  name="allowedExtensions"
                  value={formData.allowedExtensions}
                  onChange={handleInputChange}
                  placeholder="e.g., .jpg, .png, .pdf"
                  className="form-input"
                />
                <small className="form-help">Leave empty to allow all extensions for the selected file type</small>
              </div>

              <div className="form-group mb-2">
                <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="form-input"
                  placeholder="Describe the assignment requirements..."
                />
              </div>

              <div className="form-group mb-3">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Active Assignment (Visible to students)</span>
                </label>
              </div>

              <div className="form-actions border-top pt-2 flex-end">
                <button type="button" className="btn btn-outline mr-1" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments List grid */}
        {!showForm && (
           <>
              {assignments.length > 0 ? (
                <div className="assignments-grid">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="card assignment-card glass-panel flex-column h-100">
                      <div className="assignment-card-body flex-grow">
                        <div className="assignment-header-top flex-between mb-1">
                          <span className={`status-pill ${assignment.isActive ? 'active' : 'inactive'}`}>
                            {assignment.isActive ? <><FaCheckCircle /> Active</> : <><FaTimesCircle /> Inactive</>}
                          </span>
                          <span className="due-date-badge">
                            <FaCalendar /> {formatDate(assignment.dueDate)}
                          </span>
                        </div>
                        
                        <h3 className="assignment-title">{assignment.title}</h3>
                        <p className="assignment-desc line-clamp-3">{assignment.description}</p>
                        
                        <div className="assignment-meta-grid mt-2 pt-2 border-top">
                           <div className="meta-info-item">
                             <span className="meta-label">Type</span>
                             <span className="meta-value"><FaFileAlt /> {getFileTypeLabel(assignment.fileType)}</span>
                           </div>
                           <div className="meta-info-item text-right">
                             <span className="meta-label">Submissions</span>
                             <span className="meta-value"><FaUsers /> {assignment.submissions?.length || 0}</span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="assignment-card-footer mt-auto border-top pt-2 flex-between">
                         <button
                           className="btn btn-outline btn-sm btn-icon-only tooltip-trigger"
                           title="View Submissions"
                           onClick={() => setSelectedAssignment(assignment)}
                         >
                           <FaEye /> View
                         </button>
                         <div className="action-group">
                           <button
                             className="btn btn-outline btn-sm btn-icon-only text-primary mr-1"
                             title="Edit Assignment"
                             onClick={() => handleEdit(assignment)}
                           >
                             <FaEdit />
                           </button>
                           <button
                             className="btn btn-outline btn-sm btn-icon-only text-danger"
                             title="Delete Assignment"
                             onClick={() => handleDelete(assignment._id)}
                           >
                             <FaTrash />
                           </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state card full-width">
                   <div className="empty-icon-wrapper mb-2">
                     <FaFileAlt className="empty-icon" />
                   </div>
                   <h3>No Assignments Found</h3>
                   <p>You haven't created any assignments yet.</p>
                   <button 
                     className="btn btn-primary mt-2"
                     onClick={() => {
                       setShowForm(true);
                       resetForm();
                     }}
                   >
                     <FaPlus /> Create First Assignment
                   </button>
                </div>
              )}
           </>
        )}

        {/* Evaluation Modal */}
        {selectedAssignment && (
          <div className="modal-overlay animate-fade-in" onClick={() => setSelectedAssignment(null)}>
            <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedAssignment.title} <span className="text-secondary font-weight-normal text-sm ml-1">Submissions</span></h3>
                <button 
                  className="modal-close-btn"
                  onClick={() => setSelectedAssignment(null)}
                >
                  <FaTimesCircle />
                </button>
              </div>
              
              <div className="modal-body custom-scrollbar">
                <div className="assignment-quick-details mb-3 p-2 bg-surface rounded">
                  <div className="flex-between">
                     <span className="text-secondary"><FaCalendar /> Due: {formatDate(selectedAssignment.dueDate)}</span>
                     <span className="text-secondary"><FaFileAlt /> Type: {getFileTypeLabel(selectedAssignment.fileType)}</span>
                  </div>
                </div>

                <div className="submissions-section">
                  <h4 className="section-title mb-2">Student Submissions ({selectedAssignment.submissions?.length || 0})</h4>
                  {selectedAssignment.submissions && selectedAssignment.submissions.length > 0 ? (
                    <div className="submissions-list">
                      {selectedAssignment.submissions.map((submission) => (
                        <div key={submission._id} className="submission-item card mb-2 p-2 shadow-sm">
                          <div className="submission-header flex-between mb-1 pb-1 border-bottom">
                            <span className="student-name font-weight-bold"><FaUsers className="mr-1 text-primary"/>{submission.student?.fullName || 'Anonymous'}</span>
                            <span className="submission-date text-sm text-secondary">{formatDate(submission.submittedAt)}</span>
                          </div>
                          
                          <div className="submission-body mt-1">
                            <div className="submission-file">
                              <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                <FaFileAlt /> View {submission.fileName}
                              </a>
                            </div>
                            
                            {isImageFile(submission.fileName) && (
                              <div className="submission-image-preview mt-2 rounded overflow-hidden shadow-sm">
                                <img 
                                  src={submission.fileUrl} 
                                  alt={submission.fileName}
                                  className="preview-image full-width"
                                  onClick={() => window.open(submission.fileUrl, '_blank')}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                                <div className="image-error p-2 text-center bg-surface" style={{display: 'none'}}>
                                  <p className="text-secondary text-sm">Image could not be loaded inline</p>
                                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm">
                                    Click to view in new tab
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            {submission.comments && (
                              <div className="submission-comments mt-2 p-2 bg-surface rounded text-sm">
                                <strong className="text-secondary block mb-05">Student Notes:</strong> 
                                <span className="text-secondary-dark">{submission.comments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-submissions text-center p-3 text-secondary">
                      <FaFileAlt className="text-xl mb-1 opacity-50" />
                      <p>No submissions have been received yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAssignments;
