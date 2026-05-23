import React from 'react';
import { formatDate } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'idle', label: 'Idle' },
  { value: 'en_route', label: 'En Route' },
  { value: 'delivered', label: 'Delivered' },
];

function Sidebar({ statistics, statusFilter, onFilterChange, wsConnected }) {
  const getCounts = (key) => {
    if (!statistics) return 0;
    if (key === 'all') return statistics.total || 0;
    if (key === 'en_route') return statistics.en_route || 0;
    return statistics[key] || 0;
  };

  return (
    <aside className="sidebar">
      {/* Live Updates Status */}
      <div className="sidebar-card live-status-card">
        <span className={`live-indicator-dot ${wsConnected ? 'dot-active' : 'dot-inactive'}`}></span>
        <span className="live-status-text">
          {wsConnected ? 'Live Updates Active' : 'Connecting...'}
        </span>
      </div>

      {/* Filter by Status */}
      <div className="sidebar-card">
        <div className="sidebar-section-title">
          <span className="section-icon">&#10070;</span> Filter by Status
        </div>
        <div className="filter-options">
          {STATUS_OPTIONS.map((option) => (
            <label key={option.value} className="filter-radio-label">
              <input
                type="radio"
                name="statusFilter"
                value={option.value}
                checked={statusFilter === option.value}
                onChange={() => onFilterChange(option.value)}
                className="filter-radio-input"
              />
              <span className={`filter-radio-dot dot-${option.value}`}></span>
              <span className="filter-label-text">{option.label}</span>
              <span className="filter-count">( {getCounts(option.value)} )</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fleet Statistics */}
      <div className="sidebar-card">
        <div className="sidebar-section-title">
          <span className="section-icon">&#9432;</span> Fleet Statistics
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{statistics?.total ?? '—'}</div>
            <div className="stat-label">&#9874; TOTAL FLEET</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics?.average_speed != null ? `${statistics.average_speed}` : '—'}</div>
            <div className="stat-label">&#8593; AVG SPEED</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics?.en_route ?? '—'}</div>
            <div className="stat-label">&#128663; MOVING</div>
          </div>
          <div className="stat-item">
            <div className="stat-value stat-time">
              {statistics?.timestamp
                ? new Date(statistics.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '—'}
            </div>
            <div className="stat-label">&#128336; LAST UPDATE</div>
          </div>
        </div>
        {statistics?.timestamp && (
          <div className="stats-footer">
            Updated {Math.floor((Date.now() - new Date(statistics.timestamp)) / 60000)}m ago
            &bull; Next update in ~3 minutes
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
