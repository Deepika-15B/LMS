import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolderPlus, FaUpload, FaTrash, FaFolder, FaFileAlt, FaCog } from 'react-icons/fa';
import './AdminMaterials.css';

const AdminMaterials = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState({ title: '', description: '' });
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/materials/folders');
      setFolders(res.data);
    } catch (e) {
      console.error('Failed to load folders', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.title.trim()) return;
    try {
      setCreating(true);
      const res = await axios.post('/api/materials/folders', newFolder);
      setFolders(prev => [res.data, ...prev]);
      setNewFolder({ title: '', description: '' });
    } catch (e) {
      console.error('Create folder failed', e);
    } finally {
      setCreating(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFolder || files.length === 0) return;
    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await axios.post(`/api/materials/folders/${selectedFolder}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFolders(prev => prev.map(f => f._id === res.data._id ? res.data : f));
      setFiles([]);
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (folderId, fileId) => {
    if(!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`/api/materials/folders/${folderId}/files/${fileId}`);
      setFolders(prev => prev.map(f => {
        if (f._id !== folderId) return f;
        return { ...f, files: f.files.filter(file => file._id !== fileId) };
      }));
    } catch (e) {
      console.error('Delete file failed', e);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if(!window.confirm('Are you sure you want to delete this entire folder and all its contents?')) return;
    try {
      await axios.delete(`/api/materials/folders/${folderId}`);
      setFolders(prev => prev.filter(f => f._id !== folderId));
      if (selectedFolder === folderId) setSelectedFolder('');
    } catch (e) {
      console.error('Delete folder failed', e);
    }
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-materials animate-fade-in">
      <div className="container">
        <div className="dashboard-header text-center">
          <h1 className="dashboard-title justify-center">
            <FaCog className="title-icon text-gradient" /> Materials Management
          </h1>
          <p className="dashboard-subtitle">Organize topic folders and manage course resources</p>
        </div>

        <div className="admin-controls-grid">
          <div className="card glass-panel control-card">
            <h2 className="section-title"><FaFolderPlus className="text-gradient" /> Create New Folder</h2>
            <form onSubmit={handleCreateFolder} className="admin-form mt-1">
              <div className="form-group mb-1">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Folder Title (e.g. Week 1: Introduction)"
                  value={newFolder.title}
                  onChange={(e) => setNewFolder(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group mb-1">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Short Description (optional)"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={creating}>
                {creating ? 'Creating...' : 'Create Folder'}
              </button>
            </form>
          </div>

          <div className="card glass-panel control-card">
            <h2 className="section-title"><FaUpload className="text-gradient" /> Upload Files</h2>
            <div className="admin-form mt-1">
              <div className="form-group mb-1">
                <select 
                  className="form-input"
                  value={selectedFolder} 
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="" disabled>Select Target Folder</option>
                  {folders.map(f => (
                    <option key={f._id} value={f._id}>{f.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-1 file-input-wrapper">
                 <input 
                   type="file" 
                   multiple 
                   onChange={handleFileChange} 
                   accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" 
                   className="file-input-custom"
                 />
                 <div className="file-input-display">
                    <FaFileAlt /> {files.length > 0 ? `${files.length} file(s) selected` : 'Choose Files to Upload'}
                 </div>
              </div>
              <button className="btn btn-primary w-full" onClick={handleUpload} disabled={!selectedFolder || files.length === 0 || uploading}>
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </div>
        </div>

        <div className="folders-grid mt-3">
          {folders.length === 0 && (
             <div className="empty-state card full-width">
               <div className="empty-icon-wrapper"><FaFolder className="text-gradient" /></div>
               <h3>No Folders Found</h3>
               <p>Create a folder above to start organizing materials.</p>
             </div>
          )}
          {folders.map(folder => (
            <div key={folder._id} className="card folder-card">
              <div className="folder-header">
                <div className="folder-title-area">
                  <div className="folder-icon-wrapper">
                    <FaFolder />
                  </div>
                  <div className="folder-info">
                    <h3>{folder.title}</h3>
                    {folder.description && <p>{folder.description}</p>}
                  </div>
                </div>
                <button className="btn btn-danger btn-sm icon-only" onClick={() => handleDeleteFolder(folder._id)} title="Delete Folder">
                  <FaTrash />
                </button>
              </div>
              <div className="files-list">
                {folder.files.length === 0 ? (
                  <div className="empty-file-row">No files uploaded yet</div>
                ) : (
                  folder.files.map(file => (
                    <div key={file._id} className="file-row">
                      <div className="file-name">
                        <FaFileAlt className="file-type-icon" />
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-truncate">{file.originalName}</a>
                      </div>
                      <div className="file-actions">
                        <span className="file-meta">{Math.round(file.size / 1024)} KB</span>
                        <button className="delete-file-btn" onClick={() => handleDeleteFile(folder._id, file._id)} title="Delete File">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMaterials;


