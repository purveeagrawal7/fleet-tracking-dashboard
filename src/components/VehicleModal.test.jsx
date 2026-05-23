import { render, screen, fireEvent } from '@testing-library/react';
import VehicleModal from './VehicleModal';

const mockVehicle = {
  id: '1',
  vehicleNumber: 'TRK-001',
  driverName: 'John Smith',
  driverPhone: '+91-9876543210',
  status: 'en_route',
  speed: 65,
  destination: 'Mumbai',
  batteryLevel: 80,
  fuelLevel: 45,
  lastUpdated: '2024-03-15T10:00:00Z',
  currentLocation: { lat: 19.076, lng: 72.877 },
};

describe('VehicleModal', () => {
  it('renders nothing when vehicle is null', () => {
    const { container } = render(<VehicleModal vehicle={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows vehicle number and driver name', () => {
    render(<VehicleModal vehicle={mockVehicle} onClose={() => {}} />);
    expect(screen.getAllByText('TRK-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0);
  });

  it('shows the status badge', () => {
    render(<VehicleModal vehicle={mockVehicle} onClose={() => {}} />);
    expect(screen.getAllByText('EN ROUTE').length).toBeGreaterThan(0);
  });

  it('shows phone number', () => {
    render(<VehicleModal vehicle={mockVehicle} onClose={() => {}} />);
    expect(screen.getByText('+91-9876543210')).toBeInTheDocument();
  });

  it('shows battery and fuel percentages', () => {
    render(<VehicleModal vehicle={mockVehicle} onClose={() => {}} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<VehicleModal vehicle={mockVehicle} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    render(<VehicleModal vehicle={mockVehicle} onClose={onClose} />);
    fireEvent.click(document.querySelector('.modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows — for missing phone', () => {
    const vehicle = { ...mockVehicle, driverPhone: null };
    render(<VehicleModal vehicle={vehicle} onClose={() => {}} />);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
