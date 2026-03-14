import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaFilter, FaCalendar, FaUser, FaTag, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';
import './Notes.css';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notes');
      const notesData = response.data;
      
      setNotes(notesData);
      setFilteredNotes(notesData);
      
      const tags = [...new Set(notesData.flatMap(note => note.tags || []))];
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterNotes();
  }, [searchTerm, selectedTags, notes]);

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.some(tag => note.tags?.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="notes-page animate-fade-in">
      <div className="container">
        <div className="notes-header">
          <div className="header-content">
            <h1><FaBookOpen className="title-icon text-gradient" /> Learning Catalog</h1>
            <p>Explore, learn, and grow with resources shared by our community.</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/create-note" className="btn btn-primary btn-large">
              Create New Note
            </Link>
          )}
        </div>

        <div className="notes-controls card glass-panel">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, keyword, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel card animate-fade-in">
            <div className="filter-section">
              <h4>Filter by Tags</h4>
              <div className="tags-filter">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    <FaTag className="tag-icon"/>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={clearFilters} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        )}

        <div className="results-info">
          <p>
            Showing <span className="highlight-text">{filteredNotes.length}</span> of {notes.length} notes
            {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
            {selectedTags.length > 0 && <span> with tags: <strong>{selectedTags.join(', ')}</strong></span>}
          </p>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="empty-state card full-width">
            <div className="empty-state-content">
              <div className="empty-icon-wrapper"><FaSearch className="text-gradient" /></div>
              <h3>No Resources Found</h3>
              <p>
                {searchTerm || selectedTags.length > 0
                  ? 'Try adjusting your search terms or clearing your filters.'
                  : 'No notes have been published to the catalog yet.'}
              </p>
              {user?.role === 'admin' && (
                <Link to="/create-note" className="btn btn-primary">
                  Publish First Note
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note._id} className="card note-card">
                <div className="note-header">
                  <h3 className="note-title">
                    <Link to={`/notes/${note._id}`}>
                      {note.title}
                    </Link>
                  </h3>
                  <div className="note-meta">
                    <span className="note-date">
                      <FaCalendar className="meta-icon" />
                      {formatDate(note.createdAt)}
                    </span>
                    <span className="note-author">
                      <FaUser className="meta-icon" />
                      {note.author?.fullName}
                    </span>
                  </div>
                </div>

                <div className="note-content">
                  <p className="note-excerpt">
                    {note.content.length > 150
                      ? `${note.content.substring(0, 150).replace(/<[^>]*>?/gm, '')}...`
                      : note.content.replace(/<[^>]*>?/gm, '')
                    }
                  </p>
                </div>

                <div className="note-footer">
                  {note.tags && note.tags.length > 0 ? (
                    <div className="note-tags">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-pill small">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && <span className="tag-pill small">+{note.tags.length - 3}</span>}
                    </div>
                  ) : <div></div>}
                  
                  <Link to={`/notes/${note._id}`} className="read-more-link">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
