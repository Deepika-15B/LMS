import React, { useEffect, useState } from 'react';
import { FaFolder, FaDownload, FaSyncAlt, FaFileAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import './StudentDocuments.css';

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/documents/public');
      console.log('Student: Loaded documents:', response.data);
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

  const toggleDocument = (documentId) => {
    setExpanded(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }));
  };

  const handleRefresh = () => {
    console.log('Student: Manual refresh');
    loadDocuments();
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
      <div className="stu-docs animate-fade-in">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stu-docs animate-fade-in">
      <div className="container">
        <div className="app-header mb-3 text-center">
          <h1 className="dashboard-title justify-center">
            <FaFolder className="text-gradient" /> Course Documents
          </h1>
          <p className="dashboard-subtitle">View and download course documents shared by your teachers.</p>
          <button className="btn btn-outline btn-sm mt-1" onClick={handleRefresh} title="Refresh">
            <FaSyncAlt className="mr-05" /> Refresh List
          </button>
        </div>

        <div className="documents-grid mt-3">
          {documents.length === 0 && (
            <div className="empty-state card full-width p-3">
              <div className="empty-icon-wrapper mb-2">
                 <FaFolder className="empty-icon" />
              </div>
              <h3>No documents available</h3>
              <p>Your teachers haven't shared any documents yet. Check back later!</p>
            </div>
          )}
          
          {documents.map(doc => (
            <div key={doc._id} className="card document-card glass-panel flex-column p-0 h-100">
              <button 
                className={`document-head flex-between p-2 pb-1 border-bottom bg-surface w-full text-left transition ${expanded[doc._id] ? 'bg-primary-50' : ''}`}
                onClick={() => toggleDocument(doc._id)}
              >
                <div className="title flex-column flex-grow">
                  <h3 className="flex-row align-center gap-05 mt-0 mb-05 font-weight-bold">
                     <FaFolder className="text-warning" /> {doc.title}
                  </h3>
                  <div className="flex-row gap-1 align-center">
                     <span className="file-count text-sm text-tertiary font-weight-bold">
                       {doc.files.length} {doc.files.length === 1 ? 'file' : 'files'}
                     </span>
                     {doc.createdBy && (
                       <span className="author text-xs text-secondary">Added by {doc.createdBy.fullName || doc.createdBy.username}</span>
                     )}
                  </div>
                </div>
                <div className="text-tertiary">
                   {expanded[doc._id] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>
              
              {expanded[doc._id] && (
                <div className="files-list p-2 flex-grow animate-fade-in">
                  {doc.files.length === 0 && (
                    <div className="empty text-center text-sm text-tertiary p-2 border-dashed rounded">
                       No files in this document folder.
                    </div>
                  )}
                  <div className="files flex-column gap-05">
                    {doc.files.map(file => (
                      <div key={file._id} className="file-row flex-between p-1 rounded border-light bg-surface hover-lift">
                        <div className="file-info flex-row align-center gap-1 flex-grow">
                          <div className="file-icon bg-primary-100 text-primary p-1 rounded-full flex-center">
                            <FaFileAlt />
                          </div>
                          <div className="file-details flex-column flex-grow">
                             <span className="file-name font-weight-bold text-sm line-clamp-1" title={file.originalName}>{file.originalName}</span>
                             <span className="file-size text-xs text-secondary">{Math.round(file.size/1024)} KB</span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-primary btn-sm btn-icon ml-1"
                          onClick={(e) => {
                             e.stopPropagation();
                             handleDownload(doc._id, file._id, file.originalName);
                          }}
                          title="Download file"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDocuments;