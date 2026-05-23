import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the dashboard title', () => {
    render(<Header wsConnected={false} />);
    expect(screen.getByText('Fleet Tracking Dashboard')).toBeInTheDocument();
  });

  it('does not show Live badge when disconnected', () => {
    render(<Header wsConnected={false} />);
    expect(screen.queryByText('Live')).not.toBeInTheDocument();
  });

  it('shows Live badge when connected', () => {
    render(<Header wsConnected={true} />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});
