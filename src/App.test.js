import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';
import { fetchVehicles, fetchStatistics, fetchVehiclesByStatus } from './services/api';

jest.mock('./services/api', () => ({
  fetchVehicles: jest.fn(),
  fetchStatistics: jest.fn(),
  fetchVehiclesByStatus: jest.fn(),
}));

jest.mock('./hooks/useWebSocket', () => ({
  __esModule: true,
  default: () => ({ wsConnected: false }),
}));

beforeEach(() => {
  fetchVehicles.mockResolvedValue({ success: true, data: [] });
  fetchStatistics.mockResolvedValue({ success: true, data: null });
  fetchVehiclesByStatus.mockResolvedValue({ success: true, data: [] });
});

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
