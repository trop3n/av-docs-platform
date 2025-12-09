import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, FileText, Network } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>AV Documentation Platform</h1>
        <ul className="nav-links">
          <li>
            <Link to="/">
              <Home size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/documents">
              <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Documents
            </Link>
          </li>
          <li>
            <Link to="/diagrams">
              <Network size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Diagrams
            </Link>
          </li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
