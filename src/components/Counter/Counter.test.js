import React from "react";
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Counter from './Counter';

Enzyme.configure({ adapter: new Adapter() });

it('should render a document title', () => {
  const wrapper = shallow(
    <Counter
      count='0'
      onChange={()=>{}}
      max='20'
  />
  );

  expect(wrapper.find('.counterInput').prop('value')).toBe('0');
});