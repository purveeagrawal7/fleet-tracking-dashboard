import { render, screen, fireEvent } from '@testing-library/react';
import VehicleTable from './VehicleTable';

const mockVehicles = [
  {
    id: '1',
    vehicleNumber: 'TRK-001',
    driverName: 'John Smith',
    status: 'en_route',
    speed: 65,
    destination: 'Mumbai',
    estimatedArrival: '2024-03-15T14:30:00Z',
    lastUpdated: '2024-03-15T10:00:00Z',
    currentLocation: { lat: 19.076, lng: 72.877 },
  },
  {
    id: '2',
    vehicleNumber: 'TRK-002',
    driverName: 'Jane Doe',
    status: 'idle',
    speed: 0,
    destination: null,
    estimatedArrival: null,
    lastUpdated: '2024-03-15T09:00:00Z',
    currentLocation: null,
  },
];

describe('VehicleTable', () => {
  it('shows loading spinner when loading', () => {
    render(<VehicleTable vehicles={[]} onVehicleClick={() => {}} loading={true} />);
    expect(screen.getByText('Loading vehicles...')).toBeInTheDocument();
  });

  it('shows no vehicles message when list is empty', () => {
    render(<VehicleTable vehicles={[]} onVehicleClick={() => {}} loading={false} />);
    expect(screen.getByText('No vehicles found.')).toBeInTheDocument();
  });

  it('renders vehicle rows', () => {
    render(<VehicleTable vehicles={mockVehicles} onVehicleClick={() => {}} loading={false} />);
    expect(screen.getByText('TRK-001')).toBeInTheDocument();
    expect(screen.getByText('TRK-002')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('renders EN ROUTE status badge', () => {
    render(<VehicleTable vehicles={mockVehicles} onVehicleClick={() => {}} loading={false} />);
    expect(screen.getByText('EN ROUTE')).toBeInTheDocument();
  });

  it('calls onVehicleClick with the vehicle when a row is clicked', () => {
    const onVehicleClick = jest.fn();
    render(<VehicleTable vehicles={mockVehicles} onVehicleClick={onVehicleClick} loading={false} />);
    fireEvent.click(screen.getByText('TRK-001').closest('tr'));
    expect(onVehicleClick).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('shows — for missing location', () => {
    render(<VehicleTable vehicles={mockVehicles} onVehicleClick={() => {}} loading={false} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('renders all column headers', () => {
    render(<VehicleTable vehicles={[]} onVehicleClick={() => {}} loading={false} />);
    ['Vehicle', 'Driver', 'Status', 'Speed', 'Destination', 'ETA', 'Last Update', 'Location'].forEach(
      (col) => expect(screen.getByText(col)).toBeInTheDocument()
    );
  });
});
