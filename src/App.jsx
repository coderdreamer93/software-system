import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Sidebar from './component/Sidebar';

const fakeAuth = {
  isAuthenticated: true,
};

function PrivateRoute({ children }) {
  return fakeAuth.isAuthenticated ? children : <Navigate to="/" />;
}

// Sidebar ko conditionally show karne ke liye ek wrapper component banate hain
function AppWrapper({ children }) {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';

  return (
    <div>
      {showSidebar && <Sidebar />}
      <div style={{ marginLeft: showSidebar ? '240px' : '0', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [salesItems, setSalesItems] = useState([]);


  return (
    <Router>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory
                  inventoryItems={inventoryItems}
                  setInventoryItems={setInventoryItems}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Sales
                  salesItems={salesItems}
                  setSalesItems={setSalesItems}
                  inventoryItems={inventoryItems}
                  setInventoryItems={setInventoryItems}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </AppWrapper>
    </Router>
  );
}

export default App;
