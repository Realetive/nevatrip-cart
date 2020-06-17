import React from 'react';

let consoleCount = 0;

const Counter = ( props ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    consoleCount += 1;
    console.log(`${Counter.name} rerender: ${consoleCount}`);
  }

  const {
    count = 0,
    onChange,
    max
  } = props;

  return (
    <>
      <button type='button' className='counterBtn' disabled={ count <= 0 } onClick={ () => onChange( count - 1 ) }>–</button>
      <input type='number' className='counterInput' min={ 0 } value={ count } onChange={ e => onChange( parseInt( e.target.value ) || 0 )} />
      <button type='button' className='counterBtn counterBtn_view_adding' disabled={ count >= max } onClick={ () => onChange( count + 1 ) }>+</button>
    </>
  );
};

export default Counter;
