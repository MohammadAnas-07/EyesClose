import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('opens on the start screen with the privacy promise', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Your answers stay on this phone and disappear when you close this page/)).toBeInTheDocument();
  });
});
