import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import { format } from 'date-fns';
import { api } from "../../api";

const moment = require( 'moment-timezone' );
require( 'moment/locale/ru' );
const tripTimeZone = 'Europe/Moscow';

function pad (value) {
    return value < 10 ? '0' + value : value;
}

function formatOffset(offset) {
    const sign = (offset > 0) ? "-" : "+";
    const _offset = Math.abs(offset);
    const hours = pad(Math.floor(_offset / 60));
    const minutes = pad(_offset % 60);
    return sign + hours + ":" + minutes;
}

export const Time = ( { cartKey, productId } ) => {
  const { dispatch, event, order, direction: directions } = useStoreon( 'product', 'event', 'order', 'direction' );
  const [{
    direction,
    date,
    event: selectedEvent,
    isOpenTime: selectedIsOpenTime = false
  }] = order[cartKey].options;
  const [ time, setTime ] = useState( selectedEvent );
  const [ isOpenTime, setIsOpenTime ] = useState( selectedIsOpenTime );
  const {
    timeOffset = -180,
    buyTimeOffset = 0,
    dates,
    datesOpenTime,
  } = directions[`${productId}.${direction}`];
  const userTimeOffset = new Date().getTimezoneOffset();  

  const formatDate = format( new Date( date ), 'yyyy-MM-dd' );
  const eventGroup = `${ productId }.${ direction }.${ formatDate }`;
  const events = event[ eventGroup ];
  const renderTimes = events ? ( events || [] )
    .filter( eventItem => eventItem.allDay === isOpenTime )
    .map( ( eventItem, index ) => {
    const timeOffset = new Date( eventItem.start );
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
            disabled = { isOffset || isOpenTime }
          />

        <label
          className = { isOffset || isOpenTime ? 'btn-radio__label btn-radio__label_disabled'  : 'btn-radio__label' }
          htmlFor = { eventItem._key }>
          {formatTime}
        </label>
      </li>
    );
  } ) : [];

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
  }, [time, event]);

  useEffect(() => {
    order[ cartKey ].options[ 0 ].isOpenTime = isOpenTime;
    
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenTime])

  return (
    <div>
      {
        userTimeOffset !== timeOffset ?
          <div className='caption' style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e8b0c5' }}>
            Похоже, часовой пояс экскурсии отличается от вашего (UTC{ formatOffset(userTimeOffset) }).
            Указано отправление по местному времени (UTC{ formatOffset(timeOffset) }).
          </div> : null
      }
      { dates.length && datesOpenTime.length ?
          <label>
            <input type="checkbox" checked={isOpenTime} onChange={ e => setIsOpenTime( !isOpenTime ) } />
            Билет действует в течение дня по расписанию
          </label> : null
      }
      <div className='caption'>
        {
          isOpenTime ? 'Ознакомьтесь с расписанием' : 'Выберите время отправления'
        }
      </div>
      {
        <ul className='grid-list'>
          { renderTimes }
        </ul>
      }
    </div>
  );
};
