import React, { useEffect, useState } from 'react';
import { FaFolderPlus, FaUpload, FaTrash, FaFolder, FaDownload, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import './EducatorDocuments.css';

const EducatorDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/documents');
      console.log('Loaded documents:', response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newDocument.trim()) return;
    
    try {
      const response = await axios.post('/api/documents', {
        title: newDocument.trim(),
        description: ''
      });
      
      setDocuments([response.data, ...documents]);
      setNewDocument('');
      console.log('Document created:', response.data);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedDocument || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`/api/documents/${selectedDocument}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setDocuments(documents.map(doc => 
        doc._id === selectedDocument ? response.data : doc
      ));
      setFiles([]);
      setSelectedDocument('');
      console.log('Files uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document and all its files?')) {
      return;
    }

    try {
      await axios.delete(`/api/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      console.log('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteFile = async (documentId, fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/documents/${documentId}/files/${fileId}`);
      setDocuments(documents.map(doc => 
        doc._id === documentId ? response.data : doc
      ));
      console.log('File deleted');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDownload = async (documentId, fileId, filename) => {
    try {
      const response = await axios.get(`/api/documents/${documentId}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="edu-docs animate-fade-in">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edu-docs animate-fade-in">
      <div className="container">
        <div className="app-header mb-3 text-center">
          <h1 className="dashboard-title justify-center">
             <FaFolder className="text-gradient" /> Document Library
          </h1>
          <p className="dashboard-subtitle">Create document folders and upload files for students to access.</p>
        </div>

        <div className="actions-section card glass-panel">
          <form className="create-document-form" onSubmit={handleCreateDocument}>
            <div className="form-group mb-1">
              <label className="form-label">New Document Folder</label>
              <div className="input-group flex-between">
                <input
                  type="text"
                  placeholder="e.g., Week 1 Materials"
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  className="form-input flex-grow mr-1"
                  required
                />
                <button className="btn btn-primary no-wrap" type="submit">
                  <FaFolderPlus /> Create
                </button>
              </div>
            </div>
          </form>

          <form className="upload-form pt-2 border-top" onSubmit={handleUpload}>
            <div className="form-group mb-1">
              <label className="form-label">Upload Files to Folder</label>
              <select 
                value={selectedDocument} 
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="form-select flex-grow full-width mb-1"
                required
              >
                <option value="">-- Select target document folder --</option>
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
              
              <div className="upload-controls flex-between gap-1">
                 <div className="custom-file-input flex-grow">
                   <input
                     type="file"
                     multiple
                     onChange={onFileChange}
                     accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.jpg,.jpeg,.png"
                     className="file-input"
                     id="file-upload"
                   />
                   <label htmlFor="file-upload" className="file-input-display justify-center">
                     <span className="file-name text-primary font-weight-bold">
                       {files.length > 0 ? `${files.length} file(s) selected` : <><FaUpload className="mr-05" /> Choose Files</>}
                     </span>
                     <span className="btn btn-outline btn-sm">Browse</span>
                   </label>
                 </div>
                 
                 <button 
                   type="submit" 
                   className="btn btn-success no-wrap" 
                   disabled={!selectedDocument || files.length === 0 || uploading}
                 >
                   <FaUpload /> 
                   {uploading ? 'Uploading...' : 'Upload'}
                 </button>
              </div>
            </div>
          </form>
        </div>

        <div className="documents-grid mt-3">
          {documents.length === 0 && (
            <div className="empty-state card full-width">
              <div className="empty-icon-wrapper mb-2">
                 <FaFolder className="empty-icon" />
              </div>
              <h3>No Documents Yet</h3>
              <p>Create your first document folder above to start organizing files.</p>
            </div>
          )}
          
          {documents.map(doc => (
            <div key={doc._id} className="card document-card glass-panel flex-column p-0 h-100">
              <div className="document-head flex-between p-2 pb-1 border-bottom bg-surface">
                <div className="title flex-column">
                  <h3 className="flex-row align-center gap-05 mt-0 mb-05 font-weight-bold">
                     <FaFolder className="text-warning" /> {doc.title}
                  </h3>
                  <span className="file-count text-sm text-tertiary font-weight-bold">
                     {doc.files.length} {doc.files.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
                <button 
                  className="btn btn-outline border-danger text-danger btn-sm" 
                  onClick={() => handleDeleteDocument(doc._id)}
                  title="Delete Document Folder"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="files-list p-2 flex-grow">
                {doc.files.length === 0 && (
                  <div className="empty text-center text-sm text-tertiary p-2 border-dashed rounded">
                     No files in this document. Upload some above.
                  </div>
                )}
                <div className="files flex-column gap-05">
                  {doc.files.map(file => (
                    <div key={file._id} className="file-row flex-between p-1 rounded border-light bg-surface hover-lift">
                      <div className="file-info flex-row align-center gap-1">
                        <div className="file-icon bg-primary-100 text-primary p-1 rounded-full flex-center">
                          <FaFileAlt />
                        </div>
                        <div className="file-details flex-column">
                           <span className="file-name font-weight-bold text-sm line-clamp-1" title={file.originalName}>{file.originalName}</span>
                           <span className="file-size text-xs text-secondary">{Math.round(file.size/1024)} KB</span>
                        </div>
                      </div>
                      <div className="file-actions flex-row gap-05">
                        <button 
                          className="btn btn-primary btn-sm btn-icon"
                          onClick={() => handleDownload(doc._id, file._id, file.originalName)}
                          title="Download file"
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className="btn btn-outline border-danger text-danger btn-sm btn-icon" 
                          onClick={() => handleDeleteFile(doc._id, file._id)}
                          title="Delete file"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducatorDocuments;