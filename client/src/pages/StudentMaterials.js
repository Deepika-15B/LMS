import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFilePdf, FaFilePowerpoint, FaFileWord, FaFileExcel, FaDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './StudentMaterials.css';

const iconForMime = (mime) => {
  if (mime === 'application/pdf') return <FaFilePdf className="file-icon pdf text-danger" />;
  if (mime.includes('presentation')) return <FaFilePowerpoint className="file-icon ppt text-warning" />;
  if (mime.includes('word')) return <FaFileWord className="file-icon doc text-primary" />;
  if (mime.includes('excel') || mime.includes('sheet')) return <FaFileExcel className="file-icon xls text-success" />;
  return <FaDownload className="file-icon text-secondary" />;
};

const StudentMaterials = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/materials/folders');
        setFolders(res.data);
      } catch (e) {
        console.error('Failed to load materials', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const toggleFolder = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="student-materials animate-fade-in">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-materials animate-fade-in">
      <div className="container">
        <div className="app-header mb-3 text-center">
          <h1 className="dashboard-title justify-center">
             <FaFolder className="text-gradient" /> Course Materials
          </h1>
          <p className="dashboard-subtitle">Browse topic folders and view PPT, PDF, Word, and Excel files</p>
        </div>

        <div className="materials-grid mt-3">
          {folders.length === 0 && (
            <div className="empty-state card full-width p-3">
              <div className="empty-icon-wrapper mb-2">
                 <FaFolder className="empty-icon" />
              </div>
              <h3>No Materials Available</h3>
              <p>Your instructors haven't uploaded any study materials yet.</p>
            </div>
          )}

          {folders.map(folder => (
            <div key={folder._id} className="card folder-card glass-panel flex-column p-0 h-100">
              <button 
                className={`folder-toggle flex-between p-2 pb-1 border-bottom bg-surface w-full text-left transition ${expanded[folder._id] ? 'bg-primary-50' : ''}`}
                onClick={() => toggleFolder(folder._id)}
              >
                <div className="title flex-column flex-grow">
                  <h3 className="flex-row align-center gap-05 mt-0 mb-05 font-weight-bold">
                     <FaFolder className="text-warning" /> {folder.title}
                  </h3>
                  <div className="flex-row gap-1 align-center">
                     <span className="file-count text-sm text-tertiary font-weight-bold">
                       {folder.files.length} {folder.files.length === 1 ? 'file' : 'files'}
                     </span>
                     {folder.description && (
                       <span className="folder-desc text-xs text-secondary line-clamp-1">{folder.description}</span>
                     )}
                  </div>
                </div>
                <div className="text-tertiary">
                   {expanded[folder._id] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              {expanded[folder._id] && (
                <div className="files-list p-2 flex-grow animate-fade-in">
                  {folder.files.length === 0 && (
                    <div className="empty text-center text-sm text-tertiary p-2 border-dashed rounded">
                       No files available in this folder.
                    </div>
                  )}
                  <div className="files flex-column gap-05">
                    {folder.files.map(file => (
                      <a key={file._id} href={file.url} target="_blank" rel="noreferrer" className="file-link flex-between p-1 rounded border-light bg-surface hover-lift text-decoration-none">
                        <div className="file-info flex-row align-center gap-1 flex-grow">
                          <div className="file-icon-wrapper bg-primary-100 p-1 rounded-full flex-center">
                            {iconForMime(file.mimeType)}
                          </div>
                          <div className="file-details flex-column flex-grow">
                             <span className="file-name font-weight-bold text-sm text-primary line-clamp-1" title={file.originalName}>{file.originalName}</span>
                             <span className="file-size text-xs text-secondary">{Math.round(file.size / 1024)} KB</span>
                          </div>
                        </div>
                        <div className="ml-1 text-tertiary link-arrow">
                           &rarr;
                        </div>
                      </a>
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

export default StudentMaterials;


