import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('shows the product name and the privacy promise', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'EyesClose' })).toBeInTheDocument();
    expect(screen.getByText(/Nothing is sent to us/)).toBeInTheDocument();
  });
});
