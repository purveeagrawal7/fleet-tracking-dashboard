import React from 'react';

function Header({ wsConnected }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-title-row">
          <span className="header-icon">&#9726;</span>
          <h1 className="header-title">Fleet Tracking Dashboard</h1>
        </div>
        <p className="header-subtitle">Real-time vehicle monitoring &bull; LogiNext Case Study</p>
      </div>
      <div className="header-right">
        {wsConnected && (
          <span className="live-badge">
            <span className="live-dot"></span>
            Live
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
