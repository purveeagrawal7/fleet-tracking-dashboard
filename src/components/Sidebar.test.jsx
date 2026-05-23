import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

const mockStats = {
  total: 10,
  en_route: 4,
  idle: 3,
  delivered: 3,
  average_speed: 55,
  timestamp: new Date().toISOString(),
};

describe('Sidebar', () => {
  it('shows Connecting... when websocket is disconnected', () => {
    render(
      <Sidebar statistics={null} statusFilter="all" onFilterChange={() => {}} wsConnected={false} />
    );
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('shows Live Updates Active when connected', () => {
    render(
      <Sidebar statistics={null} statusFilter="all" onFilterChange={() => {}} wsConnected={true} />
    );
    expect(screen.getByText('Live Updates Active')).toBeInTheDocument();
  });

  it('renders all status filter options', () => {
    render(
      <Sidebar statistics={null} statusFilter="all" onFilterChange={() => {}} wsConnected={false} />
    );
    expect(screen.getByLabelText(/all/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('idle')).toBeInTheDocument();
    expect(screen.getByDisplayValue('en_route')).toBeInTheDocument();
    expect(screen.getByDisplayValue('delivered')).toBeInTheDocument();
  });

  it('calls onFilterChange when a filter is selected', () => {
    const onFilterChange = jest.fn();
    render(
      <Sidebar statistics={null} statusFilter="all" onFilterChange={onFilterChange} wsConnected={false} />
    );
    fireEvent.click(screen.getByDisplayValue('idle'));
    expect(onFilterChange).toHaveBeenCalledWith('idle');
  });

  it('displays statistics when provided', () => {
    render(
      <Sidebar statistics={mockStats} statusFilter="all" onFilterChange={() => {}} wsConnected={false} />
    );
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows — placeholders when statistics are null', () => {
    render(
      <Sidebar statistics={null} statusFilter="all" onFilterChange={() => {}} wsConnected={false} />
    );
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });
});
