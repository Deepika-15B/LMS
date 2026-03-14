import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaShieldAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        setIsEditing(false);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="container profile-container">
        <div className="profile-header text-center mb-3">
          <h1 className="dashboard-title justify-center">
             Your Profile
          </h1>
          <p className="dashboard-subtitle">Manage your account settings and personal information</p>
        </div>

        <div className="profile-content">
          <div className="card glass-panel profile-card">
            <div className={`profile-view ${isEditing ? 'hidden' : 'visible'}`}>
              <div className="profile-hero">
                <div className="profile-avatar-large">
                  <FaUser />
                </div>
                <div className="profile-hero-info">
                  <h2>{user?.fullName}</h2>
                  <div className="badge-container">
                     <span className={`role-badge ${user?.role === 'admin' ? 'admin' : 'student'}`}>
                       {user?.role === 'admin' ? <><FaShieldAlt /> Administrator</> : 'Student'}
                     </span>
                  </div>
                </div>
                <button
                  className="btn btn-outline edit-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit
                </button>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <div className="detail-icon"><FaUser /></div>
                  <div className="detail-content">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user?.fullName}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FaEnvelope /></div>
                  <div className="detail-content">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FaCalendar /></div>
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-edit-mode animate-fade-in">
                <div className="edit-header">
                   <h3><FaEdit className="text-gradient" /> Edit Profile Information</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-form profile-form">
                  <div className="form-row">
                    <div className="form-group mb-1">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group mb-2">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {message && (
                    <div className={`alert alert-${messageType} mb-2`}>
                      {message}
                    </div>
                  )}

                  <div className="form-actions mt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Settings Section Placeholder */}
          <div className="card settings-card mt-2">
            <div className="section-header">
              <h3 className="section-title">Account Settings</h3>
            </div>
            <div className="settings-list">
               <div className="setting-item">
                  <div className="setting-info">
                     <h4>Password & Security</h4>
                     <p>Manage your password and security preferences.</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Update</button>
               </div>
               <div className="setting-item">
                  <div className="setting-info">
                     <h4>Notifications</h4>
                     <p>Control what emails and alerts you receive.</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Manage</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
