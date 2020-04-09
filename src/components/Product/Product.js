import React, {useEffect, useState} from 'react';
import useStoreon from 'storeon/react';

import { Calendar } from '../Calendar/Calendar';
import { Directions } from '../Directions/Directions';
import { Time } from '../Time/Time';
import { Tickets } from '../Tickets/Tickets';

import './Product.css';
import {useTranslation} from 'react-i18next';

const getNearestDate = ( date, dates = [] ) => {
  return dates.includes( date ) ? date : dates[ 0 ];
};

export const Product = (props) => {
  const { t } = useTranslation();
  const { cartKey, productId, isTicketTime, isRightTranslate, lang } = props;
  const { dispatch, product, order, direction: directions } = useStoreon( 'product', 'order', 'direction' );
  const title = ( product[productId].title[lang] || {} ).name;
  let direction, date;
  if (order[cartKey].options && order[cartKey].options.length) {
    direction = order[cartKey].options[0].direction;
    date = order[cartKey].options[0].date;
  }


  const orderOptions = order[cartKey].options || [{}];
  const { dates } = directions[ `${ productId }.${ orderOptions[0].direction }` ];
  const onDateChange = ( date ) => {
    orderOptions[ 0 ].date = date;
    dispatch('order/update', order );
  };

  const [ selectedDate, setSelectedDate ] = useState( getNearestDate(date, dates) );

  const availableDates = dates.map( date => {
    const availableDate = new Date( date );
    const userTimeOffset = availableDate.getTimezoneOffset();
    availableDate.setMinutes(availableDate.getMinutes() + userTimeOffset);

    return availableDate;
  } );


  useEffect(() => {
    setSelectedDate( getNearestDate( date, availableDates ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ direction ] );



  const urlToProduct = product[productId].oldId ? `//nevatrip.ru/index.php?id=${ product[productId].oldId }` : '';

  return (
    <fieldset className='product product_view_form'>
      <legend className={ 'product__legend' + ( isRightTranslate ? '' : ' translate' ) }>
        {
          urlToProduct
            ? <a href={urlToProduct} style={{ color: 'inherit', textDecoration: 'none' }}>
                { title }
              </a>
            : title
        }
      </legend>
      <div className='product__inner'>
        <div className='colDesktop'>
          { direction && <Calendar
              lang={lang}
              isRightTranslate={isRightTranslate}
              orderOptions={orderOptions}
              dates={availableDates}
              onDateChange={onDateChange}
              selectedDate={selectedDate}
          /> }
        </div>
        <div className='colDesktop'>
          <Directions {...props} />
          {
            ( date && <Time {...props} /> ) ||
            ( isTicketTime && <div className={ 'cart__error' + ( isRightTranslate ? '' : ' translate' ) }>{ t('На выбранную дату нет прогулок') }</div> )
          }
          { direction && <Tickets {...props} /> }
        </div>
      </div>
    </fieldset>
  );
};
