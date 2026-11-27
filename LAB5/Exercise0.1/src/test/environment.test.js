import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createElement } from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import App from '../App.jsx';

import {
  AppProvider,
} from '../context/AppProvider.jsx';

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe('React environment', () => {
  it('provides a browser-like DOM environment', () => {
    expect(
      document.documentElement,
    ).toBeInTheDocument();
  });

  it('renders the application successfully', () => {
    render(
      createElement(
        AppProvider,
        null,
        createElement(App),
      ),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Pure useReducer & Split Context',
      }),
    ).toBeInTheDocument();
  });
});