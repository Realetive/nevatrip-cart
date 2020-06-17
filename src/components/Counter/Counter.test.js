import React from "react";
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Counter from './Counter';

describe('', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Counter />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('', () => {
    const wrapper = shallow(
      <Counter
        count='0'
        onChange={()=>{}}
        max='20'
    />
    );

    expect(wrapper.find('.counterInput').prop('value')).toBe('0');
  });

  it('', () => {
    const wrapper = shallow(
      <Counter
        count='0'
        onChange={()=>{}}
        max='20'
    />
    );

    wrapper.find('.counterBtn_view_adding').simulate('click');
    expect(wrapper.find('.counterInput').prop('value')).toBe('0');
  });
})