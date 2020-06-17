import React from "react";
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, fireEvent } from '@testing-library/react'
import Counter from './Counter';

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
    const div = document.createElement('div');
    ReactDOM.render(<Counter />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('', () => {
    const { getByTestId } = render(
      <Counter
        count='0'
        onChange={()=>{}}
        max='30'
      />
    );

    expect(getByTestId('value').value).toBe('0');
  });

  it('', () => {
    const { getByTestId } = render(
      <Counter
        count='1'
        onChange={()=>{}}
        max='30'
    />
    );

    expect(getByTestId('value').value).toBe('1');
    // fireEvent.click(getByTestId('add-ticket'));
    // fireEvent.click(getByTestId('add-ticket'));
    // expect(getByTestId('value').value).toBe('1');
  });
})