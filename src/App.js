import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chip from '@mui/material/Chip';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VehicleTable from './components/VehicleTable';
import VehicleModal from './components/VehicleModal';
import useWebSocket from './hooks/useWebSocket';
import { fetchVehicles, fetchStatistics, fetchVehiclesByStatus } from './services/api';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load initial statistics once
  useEffect(() => {
    fetchStatistics()
      .then((res) => { if (res.success) setStatistics(res.data); })
      .catch((err) => console.error('Stats load failed:', err));
  }, []);

  // Reload vehicle list whenever the status filter changes
  useEffect(() => {
    setLoading(true);
    const request =
      statusFilter === 'all'
        ? fetchVehicles()
        : fetchVehiclesByStatus(statusFilter);

    request
      .then((res) => { if (res.success) setVehicles(res.data); })
      .catch((err) => console.error('Vehicles load failed:', err))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  // WebSocket handler: merge incoming updates into the current vehicle list
  const handleWebSocketUpdate = useCallback((data) => {
    // Refresh stats silently
    fetchStatistics()
      .then((res) => { if (res.success) setStatistics(res.data); })
      .catch(() => {});

    // Single vehicle update
    if (data && data.id) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === data.id ? { ...v, ...data } : v))
      );
    }
    // Full vehicles array push
    if (data && Array.isArray(data.data)) {
      setVehicles(data.data);
    }
  }, []);

  const { wsConnected } = useWebSocket(handleWebSocketUpdate);

  return (
    <div className="app-root">
      <Header wsConnected={wsConnected} />

      <div className="app-body">
        <Sidebar
          statistics={statistics}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          wsConnected={wsConnected}
        />

        <main className="main-content">
          <div className="content-header">
            <h2 className="content-title">Vehicles ({vehicles.length})</h2>
            {wsConnected && (
             <Chip
             label="Live"
             size="small"
             sx={{
               backgroundColor: '#fff',
               color: '#2e7d32',
               border: '1px solid #2e7d32',
               fontWeight: 600
             }}
           />
            )}
          </div>

          <VehicleTable
            vehicles={vehicles}
            onVehicleClick={setSelectedVehicle}
            loading={loading}
          />
        </main>
      </div>

      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </div>
  );
}

export default App;
