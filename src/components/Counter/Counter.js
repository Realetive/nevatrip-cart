import React, { useState, useEffect } from 'react';

const Counter = ( props ) => {
  const { _key, defaultValue, price, getCount, onTicketChange, tickets, onChange } = props;
  // const tickets = newOrder.tickets || {};
  const [count, _setValue] = useState(defaultValue || 0);

  useEffect(() => {
    tickets.count = count;
    // onChange({...newOrder});
    getCount(_key, count);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const changeOrder = () => {
    // onChange({...newOrder});
  }

  return (
    <>
      <button type='button' className='counterBtn' disabled={ count <= 0 } onClick={ () => {
        _setValue( count - 1 );
        changeOrder()
      } }>–</button>
      <input type='number' className='counterInput' min={ 0 } value={ count } onChange={ e => {
        onTicketChange();
        _setValue( parseInt( e.target.value ) )
      } } />
      <button type='button' className='counterBtn' disabled={ count >= 3 && count * price <= 0 } onClick={ () => {
        _setValue( count + 1 );
        changeOrder();
      } }>+</button>
    </>
  );
};

export default Counter;
