import React, { useState, useEffect } from 'react';

const Counter = ( props ) => {
  const { _key, defaultValue, price, getCount, onTicketChange, newOrder, onChange } = props;
  const tickets = newOrder.tickets || {};
  const [count, _setValue] = useState(defaultValue || 0);

  useEffect(() => {
    tickets[ _key ].count = count;
    console.log('COUNTER tickets',tickets)
    console.log('COUNTER newOrder',newOrder)
    // onChange({...newOrder});
    getCount(_key, count);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const changeOrder = () => {
    console.log('∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞');
    console.log('NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW: ');
    // onChange({...newOrder});
    console.log('ˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆ');
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
