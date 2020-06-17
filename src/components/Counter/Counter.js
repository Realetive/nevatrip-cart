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
      <button
        type='button'
        className='counterBtn'
        disabled={ count <= 0 }
        onClick={ () => onChange( count - 1 ) }
        data-testid='remove-ticket'
      >
        –
      </button>
      <input
        type='number'
        className='counterInput'
        min={ 0 }
        value={ count }
        onChange={ e => onChange( parseInt( e.target.value ) || 0 )}
        data-testid='value'
      />
      <button
        type='button'
        className='counterBtn'
        disabled={ count >= max }
        onClick={ () => onChange( count + 1 ) }
        data-testid='add-ticket'
      >
        +
      </button>
    </>
  );
};

export default Counter;
