import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, X, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Custom node types for AV devices
const deviceTypes = {
  audio: { color: '#4CAF50', label: 'Audio Device' },
  video: { color: '#2196F3', label: 'Video Device' },
  network: { color: '#FF9800', label: 'Network Device' },
  control: { color: '#9C27B0', label: 'Control System' },
  display: { color: '#F44336', label: 'Display' },
  source: { color: '#00BCD4', label: 'Source' }
};

const DiagramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState('audio');

  const isEditMode = !!id;
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    if (id) {
      fetchDiagram();
    }
  }, [id]);

  const fetchDiagram = async () => {
    try {
      const response = await axios.get(`/api/diagrams/${id}`);
      const diagram = response.data.diagram;
      setTitle(diagram.title);
      setDescription(diagram.description || '');
      setCategory(diagram.category || '');
      setTags(diagram.tags?.join(', ') || '');
      setIsTemplate(diagram.isTemplate || false);

      if (diagram.diagramData) {
        setNodes(diagram.diagramData.nodes || []);
        setEdges(diagram.diagramData.edges || []);
      }
    } catch (error) {
      console.error('Error fetching diagram:', error);
      setError('Failed to load diagram');
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: `${deviceTypes[selectedDeviceType].label} ${nodes.length + 1}`
      },
      style: {
        background: deviceTypes[selectedDeviceType].color,
        color: 'white',
        border: '2px solid #222',
        borderRadius: '8px',
        padding: '10px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const diagramData = {
      title,
      description,
      category: category || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      isTemplate,
      diagramData: { nodes, edges }
    };

    try {
      if (isEditMode) {
        await axios.put(`/api/diagrams/${id}`, diagramData);
      } else {
        await axios.post('/api/diagrams', diagramData);
      }
      navigate('/diagrams');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save diagram');
    } finally {
      setLoading(false);
    }
  };

  const exportDiagram = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'diagram'}.json`;
    link.click();
  };

  if (!canEdit && !isEditMode) {
    return (
      <div className="container">
        <div className="card">
          <p>You don't have permission to create diagrams.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{isEditMode ? 'Edit Diagram' : 'New Diagram'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={exportDiagram}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', height: 'calc(100vh - 200px)' }}>
        <div className="card" style={{ overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>Properties</h3>
          <form onSubmit={handleSave}>
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: '80px' }}
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
                placeholder="e.g., Conference Room"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., Dante, HDMI"
                disabled={!canEdit}
              />
            </div>

            {canEdit && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={isTemplate}
                    onChange={(e) => setIsTemplate(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  Save as template
                </label>
              </div>
            )}

            {canEdit && (
              <>
                <hr style={{ margin: '1.5rem 0' }} />

                <h3 style={{ marginBottom: '1rem' }}>Add Device</h3>

                <div className="form-group">
                  <label htmlFor="deviceType">Device Type</label>
                  <select
                    id="deviceType"
                    value={selectedDeviceType}
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                  >
                    {Object.entries(deviceTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={addNode}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  Add Device
                </button>

                <hr style={{ margin: '1.5rem 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Diagram'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/diagrams')}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.875rem' }}>
            <strong>Tips:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.25rem' }}>
              <li>Drag devices to position them</li>
              <li>Click and drag between devices to connect them</li>
              <li>Use the controls to zoom and pan</li>
              <li>Double-click a device to edit its label</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ padding: 0, height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={canEdit ? onNodesChange : undefined}
            onEdgesChange={canEdit ? onEdgesChange : undefined}
            onConnect={canEdit ? onConnect : undefined}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default DiagramEditor;
