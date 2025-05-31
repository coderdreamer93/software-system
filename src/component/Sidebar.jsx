// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/sales">Sales</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
}
