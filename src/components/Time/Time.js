import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import { format } from 'date-fns';
import { api } from "../../api";

const moment = require( 'moment-timezone' );
require( 'moment/locale/ru' );
const tripTimeZone = 'Europe/Moscow';

export const Time = ( { cartKey, productId } ) => {
  const { dispatch, event, order, direction: directions } = useStoreon( 'product', 'event', 'order', 'direction' );
  const [ { direction, date, event: selectedEvent } ] = order[ cartKey ].options;
  const [ time, setTime ] = useState( selectedEvent );

  useEffect(() => {
    const getTimes = async ( direction, date ) => {
      const scheduleDate = new Date( date );
      const formatDate = format( scheduleDate, 'yyyy-MM-dd' );
      const times = await api.product.getProductTime( productId, direction, formatDate );

      if ( !times.length ) return;

      setTime( times[ 0 ]._key );
      dispatch('event/add', { [ `${ productId }.${ direction }.${ formatDate }` ]: times });
    }

    getTimes( direction, date );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ direction, date ]);

  useEffect(() => {
    if ( !event ) return;
    const scheduleDate = new Date( date );
    const formatDate = format( scheduleDate, 'yyyy-MM-dd' );
    const events = event[ `${productId}.${direction}.${formatDate}` ] || [];
    const action = events.find(eventItem => eventItem._key === time );

    order[ cartKey ].options[ 0 ].event = action;

    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, event])

  const formatDate = format( new Date( date ), 'yyyy-MM-dd' );
  const eventGroup = `${ productId }.${ direction }.${ formatDate }`;
  const events = event[ eventGroup ];
  const renderTimes = events ? ( events || [] ).map( ( eventItem, index ) => {
    const timeOffset = new Date( eventItem.start );
    const buyTimeOffset = directions[`${ productId }.${ direction }`].buyTimeOffset || 0;
    timeOffset.setMinutes( timeOffset.getMinutes() - buyTimeOffset );
    const isOffset = new Date() > timeOffset;

    const formatTime = moment( eventItem.start ).tz( tripTimeZone ).format( "LT" );

    return (
      <li key={ eventItem._key }
          title={ isOffset ? 'Это время уже не доступно'  : `${formatDate} в ${ formatTime }`  }
          className = 'grid-list__item'>
          <input
            type="radio"
            className = 'btn-radio'
            name = { eventGroup }
            value = { eventItem._key }
            checked = { isOffset ? false : time ? time === eventItem._key : !index }
            onChange = { e => setTime( e.target.value ) }
            id = { eventItem._key }
            disabled = { isOffset }
          />

        <label
          className = { isOffset ? 'btn-radio__label btn-radio__label_disabled'  : 'btn-radio__label'  }
          htmlFor = { eventItem._key }>
          {formatTime}
        </label>
      </li>
    );
  } ) : [];

  return (
    <div>
      <span className = 'caption'>Выберите время отправления</span>
      {
        <ul className='grid-list'>
          { renderTimes }
        </ul>
      }
    </div>
  );
};
