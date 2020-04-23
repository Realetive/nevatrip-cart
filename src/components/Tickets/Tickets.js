import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Counter from '../Counter/Counter';

import './Tickets.css';

let count = 0;

export const Tickets = ( props ) => {
  count += 1;
  console.log( `${ Tickets.name } rerender: ${ count }` );
  const { t } = useTranslation();
  const {
    lang,
    isRightTranslate,
    tickets,
    onChange,
    isDisabledBtn,
  } = props;

  const renderTickets = tickets.map( ticket => {
    const {
      _key,
      category,
      count,
      price,
    } = ticket;
    const name = (ticket.ticket.name || {})[lang] || ticket.ticket[0].title[lang];

    const onCountChange = ( count ) => {
      console.log('count', count)
      onChange(_key, count);
    }

    return (
      <div key={ _key } className='ticketsItem' data-name = {name}>
        <dt className='ticketsItemText' >
            <span className={ isRightTranslate ? '' : ' translate' }>{ t( name ) }</span>,
            <span className='ticketsItemPrice'>&nbsp;{ price }&nbsp;{t( 'currency' )}</span>
            { (category || {}).name !== 'standart' &&
              <div className={ 'ticket_category ' + ( isRightTranslate ? '' : ' translate' ) }>
                { ((category || {}).title || {} )[lang] }
              </div>
            }
        </dt>
        <dd className='ticketsItemControls' >
          <Counter
            _key={_key}
            count={count}
            price={price}
            onChange={onCountChange}
            max={ count >= 3 && count * price <= 0 ? 3 : 30 }
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
        { renderTickets }
      </dl>
      {/* <div class="caption" style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgb(232, 176, 197)' }}>
        Вы выбрали бесплатную категорию билетов — нужно выбрать сопровождающего, например, билет категории «Взрослый»
      </div> */}
    </div>
  );
};
