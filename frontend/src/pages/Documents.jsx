import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Documents</h1>
        {canEdit && (
          <Link to="/documents/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Document
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
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="card">
          <p style={{ color: '#666', textAlign: 'center' }}>
            {searchTerm ? 'No documents found matching your search.' : 'No documents yet. Create your first document!'}
          </p>
        </div>
      ) : (
        <div className="grid">
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{doc.title}</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                by {doc.author.username} • {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
              {doc.category && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {doc.category}
                </span>
              )}
              <p style={{ color: '#333', marginBottom: '1rem' }}>
                {doc.content.substring(0, 150)}...
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/documents/${doc._id}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit size={16} />
                  {canEdit ? 'Edit' : 'View'}
                </Link>
                {canEdit && (
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="btn btn-danger"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
