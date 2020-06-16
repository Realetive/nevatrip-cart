import React from 'react';
import renderer from 'react-test-renderer';
import Counter from "./Counter";
import {describe, expect, it} from "@jest/globals";

describe('Counter', () => {
  it('компонент отображается корректно', () => {
    const inputTree = renderer
      .create(<Counter
        count={ 1 }
        // price={10}
        onChange={() => {}}
        max={ 1 >= 3 && 1 * 10 <= 0 ? 3 : 30 }
      />)
      .toJSON();

    expect(inputTree).toMatchSnapshot();
  });
});