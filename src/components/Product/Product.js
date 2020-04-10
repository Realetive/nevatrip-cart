import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import { useTranslation } from 'react-i18next';

import { Calendar } from '../Calendar/Calendar';
import { Directions } from '../Directions/Directions';
import { Time } from '../Time/Time';
import { Tickets } from '../Tickets/Tickets';

import { api } from '../../api';
import './Product.css';

const getNearestDate = ( date, dates = [] ) => {
  console.log(dates.includes( date ) ? date : dates[ 0 ])
  return dates.includes( date ) ? date : dates[ 0 ];
};

export const Product = (props) => {
  const { t } = useTranslation();
  const { cartKey, productId, isTicketTime, isRightTranslate, lang } = props;
  const { dispatch, product, order, direction: directions, ticket, ticketCategory, event } = useStoreon( 'product', 'order', 'direction', 'ticket', 'ticketCategory', 'event' );
  const orderOptions = order[cartKey].options || [{}];
  const [{
    direction,
    date,
    event: selectedEvent
  }] = orderOptions;
  const { directions: directionsId } = product[productId];
  const defaultDirectionKey = direction || directions[directionsId[0]]._key;
  const title = ( product[productId].title[lang] || {} ).name;
  const { dates } = directions[ `${ productId }.${ direction }` ];
  const { tickets } = directions[ `${ productId }.${ direction }` ];
  const urlToProduct = product[productId].oldId ? `//nevatrip.ru/index.php?id=${ product[productId].oldId }` : '';

  const onDateChange = ( date ) => {
    orderOptions[ 0 ].date = date;
    dispatch('order/update', order );

  };

  const initialTickets = tickets.reduce( ( obj, ticketId ) => {
    const { _key, count } = ticket[ ticketId ];
    obj[ _key ] = count;

    return obj;
  }, {} );

  const availableDates = dates.map( date => {
    const availableDate = new Date( date );
    const userTimeOffset = availableDate.getTimezoneOffset();
    availableDate.setMinutes(availableDate.getMinutes() + userTimeOffset);

    return availableDate;
  } );

  const createFormateDate = date => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format( date );
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format( date );
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format( date );

    return `${year}-${month}-${day}`;
  };
  const formatDate = createFormateDate( new Date( date ) );
  const eventGroup = `${ productId }.${ direction }.${ formatDate }`;
  const events = event[ eventGroup ];

  const [ selectedDate, setSelectedDate ] = useState( getNearestDate(date, dates) );
  const [ _tickets, _setTickets ] = useState(initialTickets);
  const [ time, setTime ] = useState( selectedEvent );
  const [selectedDirection, _setDirection] = useState(defaultDirectionKey);

  useEffect(() => {
    order[cartKey].options[0].tickets = _tickets;
    dispatch('order/update', order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_tickets]);

  useEffect(() => {
    setSelectedDate( getNearestDate( date, availableDates ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ direction ] );

  useEffect(() => {
    if ( !event ) return;
    const scheduleDate = new Date( date );
    const formatDate = createFormateDate( scheduleDate );
    const events = event[ `${productId}.${direction}.${formatDate}` ] || [];
    const action = events.find(eventItem => eventItem._key === time );

    orderOptions[ 0 ].event = action;

    dispatch('order/update', order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, event]);

  useEffect(() => {
    const getTimes = async ( direction, date ) => {
      const scheduleDate = new Date( date );
      const formatDate = createFormateDate( scheduleDate );
      const times = await api.product.getProductTime( productId, direction, formatDate );

      if ( !times.length ) return;

      setTime( times[ 0 ]._key );
      dispatch('event/add', { [ `${ productId }.${ direction }.${ formatDate }` ]: times });
    };

    getTimes( direction, date );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ direction, date ]);

  useEffect(() => {
    order[cartKey].options = order[cartKey].options || [{}];
    order[cartKey].options[0].direction = selectedDirection;
    dispatch('order/update', order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDirection])

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
          <Directions
              isRightTranslate={isRightTranslate}
              directionsId={directionsId}
              orderOptions={orderOptions}
              selectedDirection={selectedDirection}
              _setDirection={_setDirection}
              directions={directions}
          />
          {
            ( date && <Time
                isRightTranslate={isRightTranslate}
                orderOptions={orderOptions}
                time={time}
                setTime={setTime}
                events={events}
                formatDate={formatDate}
                eventGroup={eventGroup}
            /> ) ||
            ( isTicketTime && <div className={ 'cart__error' + ( isRightTranslate ? '' : ' translate' ) }>{ t('На выбранную дату нет прогулок') }</div> )
          }
          { direction && <Tickets
              getStatus={props.getStatus}
              setDisabledBtn={props.setDisabledBtn}
              isDisabledBtn={props.isDisabledBtn}
              lang={lang}
              isRightTranslate={isRightTranslate}
              tickets={tickets}
              _tickets={_tickets}
              _setTickets={_setTickets}
              ticket={ticket}
              ticketCategory={ticketCategory}
          /> }
        </div>
      </div>
    </fieldset>
  );
};
