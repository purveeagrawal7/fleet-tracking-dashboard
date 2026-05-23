import React from 'react';
import { formatDate, formatLocation, getStatusConfig, formatSpeed } from '../utils/formatters';

function ProgressBar({ value, colorClass }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const barClass = pct < 30 ? 'progress-bar-low' : colorClass;
  return (
    <div className="progress-bar-track">
      <div className={`progress-bar-fill ${barClass}`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}

function DetailBox({ label, children }) {
  return (
    <div className="detail-box">
      <div className="detail-box-label">{label}</div>
      <div className="detail-box-value">{children}</div>
    </div>
  );
}

function VehicleModal({ vehicle, onClose }) {
  if (!vehicle) return null;

  const { label, badgeClass } = getStatusConfig(vehicle.status);
  const lat = vehicle.currentLocation?.lat;
  const lng = vehicle.currentLocation?.lng;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-vehicle-number">{vehicle.vehicleNumber}</div>
            <div className="modal-subtitle">
              {vehicle.driverName} &bull; <span className={`status-badge ${badgeClass}`}>{label}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>&#10005;</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="detail-grid">
            <DetailBox label="&#9632; STATUS">
              <span className={`status-badge ${badgeClass}`}>{label}</span>
            </DetailBox>
            <DetailBox label="&#9658; CURRENT SPEED">
              {formatSpeed(vehicle.speed)}
            </DetailBox>

            <DetailBox label="&#128100; DRIVER">
              {vehicle.driverName}
            </DetailBox>
            <DetailBox label="&#128222; PHONE">
              {vehicle.driverPhone || '—'}
            </DetailBox>

            <DetailBox label="&#128205; DESTINATION">
              {vehicle.destination || '—'}
            </DetailBox>
            <DetailBox label="&#127758; LOCATION">
              {formatLocation(lat, lng)}
            </DetailBox>
          </div>

          {/* Battery and Fuel */}
          <div className="detail-grid">
            <DetailBox label="&#9889; BATTERY LEVEL">
              <div className="progress-label">{vehicle.batteryLevel ?? '—'}%</div>
              <ProgressBar value={vehicle.batteryLevel} colorClass="progress-bar-battery" />
            </DetailBox>
            <DetailBox label="&#9981; FUEL LEVEL">
              <div className="progress-label">{vehicle.fuelLevel ?? '—'}%</div>
              <ProgressBar value={vehicle.fuelLevel} colorClass="progress-bar-fuel" />
            </DetailBox>
          </div>

          {/* Last Updated */}
          <div className="detail-grid">
            <DetailBox label="&#128336; LAST UPDATED">
              {formatDate(vehicle.lastUpdated)}
            </DetailBox>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleModal;
