import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Diagrams = () => {
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const showTemplates = searchParams.get('filter') === 'templates';

  useEffect(() => {
    fetchDiagrams();
  }, [showTemplates]);

  const fetchDiagrams = async () => {
    try {
      const url = showTemplates ? '/api/diagrams?isTemplate=true' : '/api/diagrams';
      const response = await axios.get(url);
      setDiagrams(response.data.diagrams);
    } catch (error) {
      console.error('Error fetching diagrams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diagram?')) {
      return;
    }

    try {
      await axios.delete(`/api/diagrams/${id}`);
      setDiagrams(diagrams.filter((diagram) => diagram._id !== id));
    } catch (error) {
      console.error('Error deleting diagram:', error);
      alert('Failed to delete diagram');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await axios.post(`/api/diagrams/${id}/duplicate`);
      setDiagrams([response.data.diagram, ...diagrams]);
      alert('Diagram duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating diagram:', error);
      alert('Failed to duplicate diagram');
    }
  };

  const filteredDiagrams = diagrams.filter((diagram) =>
    diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  if (loading) {
    return <div className="loading">Loading diagrams...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>{showTemplates ? 'Diagram Templates' : 'Diagrams'}</h1>
        {canEdit && (
          <Link to="/diagrams/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Diagram
          </Link>
        )}
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={20}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}
          />
          <input
            type="text"
            placeholder="Search diagrams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {filteredDiagrams.length === 0 ? (
        <div className="card">
          <p style={{ color: '#666', textAlign: 'center' }}>
            {searchTerm ? 'No diagrams found matching your search.' : showTemplates ? 'No templates yet.' : 'No diagrams yet. Create your first diagram!'}
          </p>
        </div>
      ) : (
        <div className="grid">
          {filteredDiagrams.map((diagram) => (
            <div key={diagram._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{diagram.title}</h3>
                {diagram.isTemplate && (
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    TEMPLATE
                  </span>
                )}
              </div>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                by {diagram.author.username} • {new Date(diagram.updatedAt).toLocaleDateString()}
              </p>
              {diagram.category && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {diagram.category}
                </span>
              )}
              {diagram.description && (
                <p style={{ color: '#333', marginBottom: '1rem' }}>
                  {diagram.description.substring(0, 100)}...
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={`/diagrams/${diagram._id}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit size={16} />
                  {canEdit ? 'Edit' : 'View'}
                </Link>
                {canEdit && (
                  <>
                    <button
                      onClick={() => handleDuplicate(diagram._id)}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Copy size={16} />
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(diagram._id)}
                      className="btn btn-danger"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diagrams;
