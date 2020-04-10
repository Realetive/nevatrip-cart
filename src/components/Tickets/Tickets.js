import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Counter from '../Counter/Counter';

import './Tickets.css';

export const Tickets = ( props ) => {
  const { t } = useTranslation();
  const {
      getStatus,
      setDisabledBtn,
      isDisabledBtn,
      lang,
      isRightTranslate,
      tickets,
      _tickets,
      _setTickets,
      ticket,
      ticketCategory
  } = props;
  const [statusTickets, setStatusTickets] = useState({});

  setDisabledBtn(tickets.length === 0);

  const getCount = (_key, count) => {
    setStatusTickets({
      ...statusTickets,
      [_key]: count,
      status: false,
    });
  };

  useEffect(() => {
    const status = Object.values(statusTickets).some(item => item > 0);
    getStatus( status );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTickets] );

  const _renderTickets = tickets.map( (ticketId) => {
    const {
      _key,
      category,
      count,
      price,
    } = ticket[ ticketId ];
    const name = (ticket[ ticketId ].name || {})[lang] || ticket[ ticketId ].ticket[0].title[lang];

    return (
      <div key={ _key } className='ticketsItem' data-name = {name}>
        <dt className='ticketsItemText' >
            <span className={ isRightTranslate ? '' : ' translate' }>{ t( name ) }</span>,
            <span className='ticketsItemPrice'>&nbsp;{ price }&nbsp;{t( 'currency' )}</span>
            { (ticketCategory[category] || {}).name !== 'standart' &&
              <div className={ 'ticket_category ' + ( isRightTranslate ? '' : ' translate' ) }>
                { ((ticketCategory[category] || {}).title || {} )[lang] }
              </div>
            }
        </dt>
        <dd className='ticketsItemControls' >
          <Counter
            _key={_key}
            defaultValue={count}
            tickets={_tickets}
            setTickets={_setTickets}
            price={price}
            getCount={getCount}
            isRightTranslate={isRightTranslate}
          />
        </dd>
      </div>
    )
  } );

  return (
    <div className='ticketsWrapper'>
      {
        (!isDisabledBtn &&
        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t('Выберите категории билетов') }</span>) ||
        <div className={ 'cart__error' + ( isRightTranslate ? '' : ' translate' ) }>{ t('Пока нет билетов') }</div>
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
