import React from 'react';
import { FaExternalLinkAlt, FaDownload, FaDatabase, FaCode, FaGithub, FaJava, FaNodeJs, FaGitAlt, FaCuttlefish, FaPython, FaLinux } from 'react-icons/fa';
import { SiPostman, SiDocker, SiOracle, SiPostgresql, SiMysql, SiGnubash } from 'react-icons/si';
import './Prerequisites.css';

const defaultLinks = [
  { name: 'MongoDB Server', url: 'https://www.mongodb.com/try/download/community', desc: 'Self-managed MongoDB for local development.', icon: <FaDatabase className="prereq-icon text-success" /> },
  { name: 'Visual Studio Code', url: 'https://code.visualstudio.com/download', desc: 'Free, extensible code editor.', icon: <FaCode className="prereq-icon text-primary" /> },
  { name: 'GitHub Desktop', url: 'http://desktop.github.com/download/', desc: 'Simplified Git GUI client.', icon: <FaGithub className="prereq-icon text-secondary-dark" /> },
  { name: 'Oracle Java JDK', url: 'https://www.oracle.com/java/technologies/downloads/', desc: 'Download Java Development Kit.', icon: <FaJava className="prereq-icon text-danger" /> },
  { name: 'Node.js', url: 'https://nodejs.org/en/download', desc: 'JavaScript runtime for backend tools.', icon: <FaNodeJs className="prereq-icon text-success" /> },
  { name: 'Git', url: 'https://git-scm.com/downloads', desc: 'Distributed version control system.', icon: <FaGitAlt className="prereq-icon text-warning" /> },
  { name: 'Postman', url: 'https://www.postman.com/downloads/', desc: 'API client for testing routes.', icon: <SiPostman className="prereq-icon text-warning" /> },
  { name: 'Docker Desktop', url: 'https://www.docker.com/products/docker-desktop/', desc: 'Build and run containers locally.', icon: <SiDocker className="prereq-icon text-primary" /> },
  { name: 'Python', url: 'https://www.python.org/downloads/', desc: 'Popular programming language.', icon: <FaPython className="prereq-icon text-info" /> },
  { name: 'MySQL Community', url: 'https://dev.mysql.com/downloads/mysql/', desc: 'Open-source relational database.', icon: <SiMysql className="prereq-icon text-primary" /> },
  { name: 'PostgreSQL', url: 'https://www.postgresql.org/download/', desc: 'Advanced open-source database.', icon: <SiPostgresql className="prereq-icon text-primary" /> },
  { name: '7-Zip', url: 'https://www.7-zip.org/download.html', desc: 'Free file archiver and extractor.', icon: <SiGnubash className="prereq-icon text-secondary" /> }
];

const Prerequisites = () => {
  return (
    <div className="prereq animate-fade-in py-3 min-height-100vh">
      <div className="container">
        <div className="page-header text-center mb-3">
          <h1 className="dashboard-title">Prerequisites</h1>
          <p className="text-secondary">Recommended software and tools for your learning environment.</p>
        </div>

        <div className="cards dashboard-grid">
          {defaultLinks.length > 0 ? (
            defaultLinks.map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="card glass-panel hover-lift text-decoration-none prereq-card-link">
                <div className="card-body flex-row gap-1">
                  <div className="prereq-icon-wrapper flex-shrink-0 mt-05">
                     {link.icon || <FaDownload className="prereq-icon text-primary rounded-bg" />}
                  </div>
                  <div>
                    <div className="card-title text-primary font-weight-bold mb-05 text-lg">{link.name}</div>
                    <div className="card-desc text-secondary text-sm line-clamp-2">{link.desc}</div>
                  </div>
                </div>
                <div className="prereq-card-footer border-top pt-1 mt-1 flex-between align-center text-secondary text-sm">
                  <span className="flex-row gap-05 align-center text-primary-light">
                    Download <FaDownload className="text-xs" />
                  </span>
                  <FaExternalLinkAlt className="text-secondary-light" />
                </div>
              </a>
            ))
          ) : (
             <div className="empty-state card full-width p-3 text-center grid-column-span-3">
               <p className="text-secondary">No prerequisite software links have been configured yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prerequisites;
