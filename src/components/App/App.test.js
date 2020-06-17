import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import App from './App';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));

describe('', () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders without crashing', () => {
    ReactDOM.render(<App />, container);
  });
})