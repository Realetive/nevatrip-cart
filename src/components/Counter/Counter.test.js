import React, { useState } from "react";
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
    ReactDOM.render(<Counter />, container);
  });

  it('', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Counter
        count='0'
        onChange={onChange}
        max='30'
      />
    );

    expect(getByTestId('value').value).toBe('0');
  });

  it('', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Counter
        count='1'
        onChange={onChange}
        max='30'
    />
    );

    expect(getByTestId('value').value).toBe('1');
  });

  // it('', () => {
  //   let [ count, setCount] = useState('0')
  //   const onChange = jest.fn(() => setCount(count +1));
  //   const { getByTestId } = render(
  //     <Counter
  //       count={count}
  //       onChange={onChange}
  //       max='30'
  //   />
  //   );
  //
  //   fireEvent.click(getByTestId('add-ticket'));
  //   fireEvent.click(getByTestId('add-ticket'));
  //   fireEvent.click(getByTestId('add-ticket'));
  //   expect(getByTestId('value').value).toBe('2');
  // });
})