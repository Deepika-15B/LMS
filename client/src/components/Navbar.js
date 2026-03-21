import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGraduationCap, FaBars, FaTimes, FaUser, FaSignOutAlt, FaBook, FaHome, FaChalkboardTeacher, FaFolderOpen, FaPlusCircle, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'educator') return '/educator/documents';
    return '/student/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <FaGraduationCap className="brand-icon" />
          <span>SKILLUP</span>
        </Link>

        {user && (
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
              <FaHome /> Home
            </Link>
            
            <Link to={getDashboardLink()} className={`nav-link ${isActive('/student/dashboard') || isActive('/admin/dashboard') || isActive('/educator') ? 'active' : ''}`} onClick={closeMenu}>
              <FaChalkboardTeacher /> {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>

            <Link to="/student/quizzes" className={`nav-link ${isActive('/student/quizzes') ? 'active' : ''}`} onClick={closeMenu}>
              <FaBook /> Quizzes
            </Link>
            
            <Link to="/notes" className={`nav-link ${isActive('/notes') ? 'active' : ''}`} onClick={closeMenu}>
              <FaFolderOpen /> Notes
            </Link>

            <Link to="/prerequisites" className={`nav-link ${isActive('/prerequisites') ? 'active' : ''}`} onClick={closeMenu}>
              <FaClipboardList /> Prerequisites
            </Link>

            {/* Documents Link for Clients/Educators */}
            {user.role !== 'admin' && (
              <Link 
                to={user.role === 'student' ? '/student/documents' : '/educator/documents'} 
                className={`nav-link ${isActive('/student/documents') || isActive('/educator/documents') ? 'active' : ''}`} 
                onClick={closeMenu}
              >
                <FaFileAlt /> Documents
              </Link>
            )}
          </div>
        )}

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile" onClick={closeMenu}>
                <FaUser className="user-icon" />
                <span className="user-name">{user.fullName || user.username || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt />
                <span className="user-name">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                Get Started
              </Link>
            </div>
          )}
          
          {user && (
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
