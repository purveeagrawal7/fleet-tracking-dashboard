import React from 'react';
import { formatDate, formatLocation, getStatusConfig, formatSpeed, formatETA } from '../utils/formatters';

function VehicleTable({ vehicles, onVehicleClick, loading }) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <span>Loading vehicles...</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Speed</th>
            <th>Destination</th>
            <th>ETA</th>
            <th>Last Update</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={8} className="no-data">No vehicles found.</td>
            </tr>
          ) : (
            vehicles.map((vehicle) => {
              const { label, badgeClass } = getStatusConfig(vehicle.status);
              return (
                <tr
                  key={vehicle.id}
                  className="vehicle-row"
                  onClick={() => onVehicleClick(vehicle)}
                >
                  <td>
                    <span className="vehicle-number">{vehicle.vehicleNumber}</span>
                  </td>
                  <td>{vehicle.driverName}</td>
                  <td>
                    <span className={`status-badge ${badgeClass}`}>{label}</span>
                  </td>
                  <td>{formatSpeed(vehicle.speed)}</td>
                  <td className="destination-cell">{vehicle.destination || '—'}</td>
                  <td>{formatETA(vehicle.estimatedArrival)}</td>
                  <td className="date-cell">{formatDate(vehicle.lastUpdated)}</td>
                  <td className="location-cell">
                    {vehicle.currentLocation
                      ? formatLocation(vehicle.currentLocation.lat, vehicle.currentLocation.lng)
                      : '—'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleTable;
