import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStoreon from 'storeon/react';

import Counter from '../Counter/Counter';

import './Tickets.css';

export const Tickets = ({ cartKey, productId, getStatus, getDisabled, isDisabled }) => {
  const { t } = useTranslation();
  const { dispatch, direction, order, ticket } = useStoreon('direction', 'order', 'ticket');
  const [{ direction: selectedDirection }] = order[cartKey].options;
  const tickets = direction[ `${ productId }.${ selectedDirection }` ].tickets;
  const [statusTickets, setStatusTickets] = useState({});
  const currentLang = process.env.REACT_APP_DEFAULT_LANG;

  getDisabled(tickets.length === 0);

  const initialTickets = tickets.reduce( ( obj, ticketId ) => {
    const { _key, count } = ticket[ ticketId ];
    obj[ _key ] = count;

    return obj;
  }, {} );

  const [ _tickets, _setTickets ] = useState(initialTickets);

  useEffect(() => {
    order[cartKey].options[0].tickets = _tickets;
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_tickets]);

  const getCount = (_key, count) => {
    setStatusTickets({
      ...statusTickets,
      [_key]: count,
    });
  };

  useEffect(() => {
    const status = Object.values(statusTickets).some(item => item > 0);
    getStatus( status );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTickets] );

  const _renderTickets = tickets.map( (ticketId, ticketIndex) => {
    const {
      _key,
      // category,
      count,
      price,
    } = ticket[ ticketId ];
    const name = (ticket[ ticketId ].name || {})[currentLang] || ticket[ ticketId ].ticket[0].title[currentLang];

    return (
      <div key={ _key } className='ticketsItem' data-name = {name}>
        <dt className='ticketsItemText' >
            { t( name ) },<span className='ticketsItemPrice'>&nbsp;{ price }&nbsp;{t( 'currency' )}</span>
        </dt>
        <dd className='ticketsItemControls' >
          <Counter
            _key={_key}
            defaultValue={count}
            tickets={_tickets}
            setTickets={_setTickets}
            price={price}
            getCount={getCount}
          />
        </dd>
      </div>
    )
  } );

  return (
    <div className='ticketsWrapper'>
      {
        (!isDisabled &&
        <span className='caption'>{ t('Выберите категории билетов') }</span>) ||
        <span className='caption caption_l'>{ t('Пока нет билетов') }</span>
      }
      <dl className='ticketsDl'>
        { _renderTickets }
      </dl>
      {/* <div class="caption" style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgb(232, 176, 197)' }}>
        Вы выбрали бесплатную категорию билетов — нужно выбрать сопровождающего, например, билет категории «Взрослый»
      </div> */}
    </div>
  );
};
