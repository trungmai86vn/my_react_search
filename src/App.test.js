import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Live Search: React Application', () => {
  const { getByText } = render(<App />);
  const appTitle = getByText(/Live Search: React Application/i);
  expect(appTitle).toBeInTheDocument();
});
