import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

jest.mock('./services/api', () => ({
  fetchVehicles: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  fetchStatistics: jest.fn(() => Promise.resolve({ success: true, data: null })),
  fetchVehiclesByStatus: jest.fn(() => Promise.resolve({ success: true, data: [] })),
}));

jest.mock('./hooks/useWebSocket', () => () => ({ wsConnected: false }));

describe('App', () => {
  it('renders the dashboard header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Fleet Tracking Dashboard')).toBeInTheDocument();
  });

  it('shows vehicle count in heading', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Vehicles \(/i)).toBeInTheDocument();
  });
});
