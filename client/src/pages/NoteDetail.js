import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaUser, FaEdit, FaTrash, FaShare, FaBookmark, FaComments } from 'react-icons/fa';
import axios from 'axios';
import './NoteDetail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await axios.get(`/api/notes/${id}`);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`/api/notes/${id}/comments`, { content: comment });
      setComment('');
      fetchNote();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    // Basic frontend check
    if (!hasEditAccess()) return;
    const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/notes/${id}`);
      navigate('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert(error.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const hasEditAccess = () => {
    if (!user || !note) return false;
    
    if (user.role === 'admin') return true;
    
    if (note.author?._id === user._id) return true;
    
    if (note.accessList && note.accessList.length > 0) {
      const userAccess = note.accessList.find(access => access.user === user._id);
      return userAccess && userAccess.accessType === 'edit';
    }
    
    return false;
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-not-found container">
        <div className="empty-state card full-width">
          <h2>Resource Not Found</h2>
          <p>The note you are looking for may have been deleted or doesn't exist.</p>
          <Link to="/notes" className="btn btn-primary mt-2">
            <FaArrowLeft /> View Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-page animate-fade-in">
      <div className="container note-detail-layout">
        <div className="note-main-content">
          <div className="note-header-nav">
            <Link to="/notes" className="back-btn">
              <FaArrowLeft />
              Back to Catalog
            </Link>
            
            <div className="note-actions">
              <button className="btn btn-outline btn-sm icon-btn" title="Save Note">
                 <FaBookmark />
              </button>
              <button className="btn btn-outline btn-sm icon-btn" title="Share Note">
                 <FaShare />
              </button>
            </div>
          </div>

          <article className="card note-article glass-panel">
            <header className="article-header">
              {note.tags && note.tags.length > 0 && (
                <div className="article-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="tag-pill small">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="article-title">{note.title}</h1>
              
              <div className="article-meta">
                <div className="meta-author">
                  <div className="author-avatar">
                     <FaUser />
                  </div>
                  <div className="author-info">
                     <span className="author-name">{note.author?.fullName || 'Anonymous'}</span>
                     <span className="publish-date">{formatDate(note.createdAt)}</span>
                  </div>
                </div>
                {hasEditAccess() && (
                  <div className="author-actions">
                    <Link to={`/notes/${id}/edit`} className="btn btn-outline btn-sm">
                      <FaEdit />
                      Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                      <FaTrash />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="article-body">
              <div 
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
            
            <footer className="article-footer">
               <div className="engagement-stats">
                  <span className="stat-item"><FaComments className="text-secondary" /> {note.comments?.length || 0} Comments</span>
               </div>
            </footer>
          </article>

          <section className="comments-section card" id="comments">
            <div className="section-header">
              <h3>Discussion ({note.comments?.length || 0})</h3>
            </div>
            
            {user ? (
              <div className="comment-compose">
                <div className="author-avatar small">
                  <FaUser />
                </div>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts on this note..."
                    className="form-input comment-input"
                    rows="3"
                    required
                  />
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting || !comment.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="login-prompt">
                <p>Please <Link to="/login" className="text-primary">log in</Link> to join the discussion.</p>
              </div>
            )}

            <div className="comments-list mt-3">
              {note.comments && note.comments.length > 0 ? (
                note.comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-avatar">
                      <FaUser />
                    </div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user?.fullName || 'User'}</span>
                        <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      </div>
                      <div className="comment-content">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-comments">
                  <FaComments className="empty-icon" />
                  <p>No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </section>
        </div>
        
        {/* Placeholder for future sidebar elements like Table of Contents or Related Notes */}
        <div className="note-sidebar hidden-mobile">
           <div className="card glass-panel sticky-sidebar">
             <h4 className="sidebar-title">About this note</h4>
             <div className="sidebar-meta-list">
               <div className="meta-row">
                 <span className="meta-label">Author</span>
                 <span className="meta-value">{note.author?.fullName || 'Unknown'}</span>
               </div>
               <div className="meta-row">
                 <span className="meta-label">Published</span>
                 <span className="meta-value">{new Date(note.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="meta-row">
                 <span className="meta-label">Word Count</span>
                 <span className="meta-value">{note.content ? note.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0} words</span>
               </div>
             </div>
             
             {note.tags && note.tags.length > 0 && (
               <div className="sidebar-tags mt-2">
                 <h4 className="sidebar-subtitle">Tags</h4>
                 <div className="tags-container">
                   {note.tags.map(tag => (
                     <span key={tag} className="tag-pill small">{tag}</span>
                   ))}
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
