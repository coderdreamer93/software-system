// src/pages/Dashboard.jsx
import Sidebar from '../component/Sidebar';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h2>Welcome to Dashboard</h2>
        <p>This is your dashboard content.</p>
      </div>
    </div>
  );
}
