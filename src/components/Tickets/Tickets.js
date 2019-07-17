import React, {useState, useEffect} from 'react';
import useStoreon from 'storeon/react';

import Counter from '../Counter/Counter';

export const Tickets = ({ cartKey, productId }) => {
  const { dispatch, direction, order, ticket } = useStoreon('direction', 'order', 'ticket');
  const { direction: selectedDirection } = order[cartKey].options;
  const tickets = direction[ `${ productId }.${ selectedDirection }` ].tickets;
  const initialTickets = tickets.reduce( ( obj, ticketId ) => {
    const { _key, count } = ticket[ ticketId ];
    obj[ _key ] = count;
    
    return obj;
  }, {} );

  const [ _tickets, _setTickets ] = useState(initialTickets);
  
  useEffect(() => {
    order[cartKey].options.tickets = _tickets;
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_tickets]);

  const _renderTickets = tickets.map( ticketId => {
    const {
      _key,
      // category,
      count,
      name,
      price
    } = ticket[ ticketId ];

    return (
      <div key={ _key } className='ticketsItem'>
        <dt className='ticketsItemText' >
          { name || '???' }, { price } ₽
        </dt>
        <dd className='ticketsItemControls' >
          <Counter
            _key={ _key }
            defaultValue={ count }
            tickets={ _tickets }
            setTickets={ _setTickets }
          />
        </dd>
      </div>
    )
  } );

  return (
    <div className='ticketsWrapper'>
      <span className='caption'>
        Выберите категории билетов
      </span>
      <dl>
        { _renderTickets }
      </dl>
    </div>
  );
};
