import React, { useState, useEffect } from 'react';

const Counter = ({ _key, tickets, setTickets, defaultValue }) => {
  const [count, _setValue] = useState(defaultValue || 0);
  
  useEffect(() => {
    setTickets({ ...tickets, [ _key ]: count });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <>
      <button type='button' className='counterBtn' disabled={ count <= 0 } onClick={ () => _setValue( count - 1 ) }>–</button>
      <input type='number' className='counterInput' min={ 0 } value={ count } onChange={ e => _setValue( parseInt( e.target.value ) ) } />
      <button type='button' className='counterBtn' onClick={ () => _setValue( count + 1 ) }>+</button>
    </>
  );
};

export default Counter;
