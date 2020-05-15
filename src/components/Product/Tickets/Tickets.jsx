import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Counter from '../../Counter/Counter';

import './Tickets.css';
import LangContext from '../../App';

let count = 0;

export const Tickets = ( { tickets, selectedTickets, onChange } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${Tickets.name} rerender: ${count}`);
  }
  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );

  const renderTickets = tickets.map( ( { _key, category, price, ticket: [ { name, title } ] }, index ) => {
    const heading = title[ t( 'locale' ) ] || name;
    const count = index === 0 ? 1 : 0;

    const onCountChange = ( count ) => onChange(_key, count);

    return (
      <div key={ _key } className={ 'ticketsItem ticketsItem_view_' + name }>
        <dt className='ticketsItemText' >
            <span className={ isRightTranslate ? '' : ' translate' }>{ heading }</span>,
            <span className='ticketsItemPrice'>&nbsp;{ price }&nbsp;{t( 'currency' )}</span>
            { category.name !== 'standart' &&
              <div className={ 'ticket_category ' + ( isRightTranslate ? '' : ' translate' ) }>
                { (category.title || {} )[ t('locale') ] }
              </div>
            }
        </dt>
        <dd className='ticketsItemControls' >
          <Counter
            _key={_key}
            count={ count }
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
      <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t('Выберите категории билетов') }</span>
      <dl className='ticketsDl'>
        { renderTickets }
      </dl>
      {/* <div class="caption" style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgb(232, 176, 197)' }}>
        Вы выбрали бесплатную категорию билетов — нужно выбрать сопровождающего, например, билет категории «Взрослый»
      </div> */}
    </div>
  );
};
