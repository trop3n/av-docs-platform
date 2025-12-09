import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Network, Plus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    documents: 0,
    diagrams: 0,
    templates: 0
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentDiagrams, setRecentDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [docsRes, diagramsRes, templatesRes] = await Promise.all([
        axios.get('/api/documents'),
        axios.get('/api/diagrams'),
        axios.get('/api/diagrams?isTemplate=true')
      ]);

      setStats({
        documents: docsRes.data.documents.length,
        diagrams: diagramsRes.data.diagrams.length,
        templates: templatesRes.data.diagrams.length
      });

      setRecentDocs(docsRes.data.documents.slice(0, 5));
      setRecentDiagrams(diagramsRes.data.diagrams.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <FileText size={32} color="#3498db" />
            <div>
              <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.documents}</h3>
              <p style={{ color: '#666', margin: 0 }}>Documents</p>
            </div>
          </div>
          <Link to="/documents/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Document
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Network size={32} color="#2ecc71" />
            <div>
              <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.diagrams}</h3>
              <p style={{ color: '#666', margin: 0 }}>Diagrams</p>
            </div>
          </div>
          <Link to="/diagrams/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Diagram
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Network size={32} color="#9b59b6" />
            <div>
              <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.templates}</h3>
              <p style={{ color: '#666', margin: 0 }}>Templates</p>
            </div>
          </div>
          <Link to="/diagrams?filter=templates" className="btn btn-secondary">
            View Templates
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Documents</h2>
            <Link to="/documents">View All</Link>
          </div>
          {recentDocs.length === 0 ? (
            <p style={{ color: '#666' }}>No documents yet</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {recentDocs.map((doc) => (
                <li key={doc._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <Link to={`/documents/${doc._id}`}>{doc.title}</Link>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    by {doc.author.username} • {new Date(doc.updatedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Diagrams</h2>
            <Link to="/diagrams">View All</Link>
          </div>
          {recentDiagrams.length === 0 ? (
            <p style={{ color: '#666' }}>No diagrams yet</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {recentDiagrams.map((diagram) => (
                <li key={diagram._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <Link to={`/diagrams/${diagram._id}`}>{diagram.title}</Link>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    by {diagram.author.username} • {new Date(diagram.updatedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
