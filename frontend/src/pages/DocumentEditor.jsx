import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const isEditMode = !!id;
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      const doc = response.data.document;
      setTitle(doc.title);
      setContent(doc.content);
      setCategory(doc.category || '');
      setTags(doc.tags?.join(', ') || '');
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('Failed to load document');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const documentData = {
      title,
      content,
      category: category || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()) : []
    };

    try {
      if (isEditMode) {
        await axios.put(`/api/documents/${id}`, documentData);
      } else {
        await axios.post('/api/documents', documentData);
      }
      navigate('/documents');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save document');
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit && !isEditMode) {
    return (
      <div className="container">
        <div className="card">
          <p>You don't have permission to create documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>{isEditMode ? 'Edit Document' : 'New Document'}</h1>
        <button
          onClick={() => setPreview(!preview)}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {preview ? <EyeOff size={18} /> : <Eye size={18} />}
          {preview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Audio, Video, Network"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., HDMI, Projector, Dante"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content (Markdown supported)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ minHeight: '400px', fontFamily: 'monospace' }}
                disabled={!canEdit}
              />
            </div>

            {canEdit && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Document'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/documents')}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {preview && (
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Preview</h2>
            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <h1>{title || 'Untitled'}</h1>
              {category && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {category}
                </span>
              )}
              <ReactMarkdown>{content || 'No content yet...'}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
