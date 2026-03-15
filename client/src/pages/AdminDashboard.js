import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaFolderOpen, FaPlusCircle, FaChalkboardTeacher, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      title: 'Manage Assignments',
      desc: 'Review and grade student assignment submissions.',
      icon: <FaChalkboardTeacher className="admin-feature-icon text-primary" />,
      link: '/admin/assignments',
      colorClass: 'primary'
    },
    {
      title: 'Course Resources',
      desc: 'Create, edit, and organize public course notes.',
      icon: <FaPlusCircle className="admin-feature-icon text-success" />,
      link: '/create-note',
      colorClass: 'success'
    },
    {
      title: 'Educator Documents',
      desc: 'Manage internal documents shared with educators.',
      icon: <FaFolderOpen className="admin-feature-icon text-warning" />,
      link: '/admin/documents',
      colorClass: 'warning'
    },
    {
      title: 'Manage Quizzes',
      desc: 'Create, edit, and organize dynamic quizzes for students.',
      icon: <FaBook className="admin-feature-icon text-info" />,
      link: '/admin/quizzes',
      colorClass: 'info'
    }
  ];

  return (
    <div className="admin-dashboard animate-fade-in py-3 min-height-100vh">
      <div className="container">
        
        {/* Welcome Header */}
        <div className="admin-welcome-hero glass-panel mb-3">
          <div className="hero-content flex-between align-center">
            <div>
               <h1 className="hero-title m-0">Welcome back, <span className="text-gradient font-weight-bold">{user?.fullName || user?.username || 'Administrator'}</span>! 👋</h1>
               <p className="hero-subtitle text-secondary mt-05">Here is what is happening with your learning platform today.</p>
            </div>
            <div className="hero-badge hidden-mobile flex-row align-center gap-05 bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-weight-bold">
               <FaCheckCircle /> System Healthy
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <h2 className="dashboard-subtitle mb-2">Management Tools</h2>
        <div className="cards dashboard-grid admin-features-grid">
           {adminFeatures.map((feature, idx) => (
             <Link to={feature.link} key={idx} className={`card glass-panel hover-lift text-decoration-none border-hover-${feature.colorClass} admin-feature-card`}>
                <div className="card-body">
                   <div className={`icon-container bg-${feature.colorClass}-light mb-1`}>
                      {feature.icon}
                   </div>
                   <h3 className="card-title font-weight-bold mb-05">{feature.title}</h3>
                   <p className="card-desc text-secondary text-sm">{feature.desc}</p>
                </div>
                <div className={`card-footer border-top text-${feature.colorClass} font-weight-bold flex-between align-center`}>
                   <span>Open Tool</span>
                   <FaArrowRight className="access-icon" />
                </div>
             </Link>
           ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
