import React from 'react';
import { formatDate, formatLocation, getStatusConfig, formatSpeed, formatETA } from '../utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function VehicleTable({ vehicles, onVehicleClick, loading }) {
  if (loading) {
    return (
      <div className="table-loading">
        <CircularProgress size={24} color="success" />
        <span>Loading vehicles...</span>
      </div>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}
    >
      <Table size="small">

        {/* HEADER */}
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-head': {
                backgroundColor: '#f1f6ff',
                fontSize: 11,
                fontWeight: 900,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #dbeafe'
              }
            }}
          >
            <TableCell>Vehicle</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Speed</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>ETA</TableCell>
            <TableCell>Last Update</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No vehicles found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => {
              const { label, badgeClass } = getStatusConfig(vehicle.status);

              return (
                <TableRow
                  key={vehicle.id}
                  hover
                  onClick={() => onVehicleClick(vehicle)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <strong style={{ color: '#2563eb' }}>
                      {vehicle.vehicleNumber}
                    </strong>
                  </TableCell>

                  <TableCell>{vehicle.driverName}</TableCell>

                  {/* STATUS → MUI CHIP */}
                  <TableCell>
                    <Chip
                      label={label}
                      size="small"
                      variant="filled"
                      sx={{
                        fontWeight: 600,
                        borderRadius: '12px',
                        height: 22,

                        '& .MuiChip-label': {
                          px: 1
                        },

                        ...(label === 'DELIVERED' && {
                          bgcolor: '#dcfce7',
                          color: '#16a34a',
                          border: '1px solid #bbf7d0'
                        }),

                        ...(label === 'EN ROUTE' && {
                          bgcolor: '#dbeafe',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe'
                        }),

                        ...(label === 'IDLE' && {
                          bgcolor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fde68a'
                        })
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.3,
                        borderRadius: '999px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: 12,
                        fontWeight: 600,
                        minWidth: 50,
                        justifyContent: 'center'
                      }}
                    >
                      {formatSpeed(vehicle.speed)}
                    </Box>
                  </TableCell>

                  <TableCell>
                    {vehicle.destination || '—'}
                  </TableCell>

                  <TableCell>
                    {formatETA(vehicle.estimatedArrival)}
                  </TableCell>

                  <TableCell>
                    {formatDate(vehicle.lastUpdated)}
                  </TableCell>

                  <TableCell>
                    {vehicle.currentLocation
                      ? formatLocation(
                        vehicle.currentLocation.lat,
                        vehicle.currentLocation.lng
                      )
                      : '—'}
                  </TableCell>

                </TableRow>
              );
            })
          )}
        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default VehicleTable;
