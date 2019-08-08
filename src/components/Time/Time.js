import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import { format } from 'date-fns';
import {convertToTimeZone} from 'date-fns-timezone';
import { api } from "../../api";


export const Time = ({ cartKey, productId }) => {
  const { dispatch, event, order, direction: directions } = useStoreon( 'product', 'event', 'order', 'direction' );
  const [{ direction, date, event: selectedEvent }] = order[ cartKey ].options;
  const [ time, _setTime ] = useState( selectedEvent );

  useEffect(() => {
    const getTimes = async (direction, date) => {
      const scheduleDate = typeof date === 'string' ? new Date(date) : date;
      const formatDate = format( scheduleDate, 'yyyy-MM-dd' );
      const times = await api.product.getProductTime(productId, direction, formatDate);
      if(!times.length) return;

      _setTime(times[0]._key);

      dispatch('event/add', { [`${productId}.${direction}.${formatDate}`]: times });
    }

    getTimes(direction, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, date]);

  useEffect(() => {
    const action = Object.values(event).find(eventItem => eventItem[0]._key === time);
    order[cartKey].options[0].event = action ? action[0] : {};
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, event])

  const formatDate = format( typeof date === 'string' ? new Date(date) : date, 'yyyy-MM-dd' );
  const eventGroup = `${productId}.${direction}.${formatDate}`;
  const events = event[eventGroup];
  const renderTimes = events ? (events || []).map((eventItem, index) => {
    const timeOffset = new Date(eventItem.start)
    const buyTimeOffset = directions[`${productId}.${direction}`].buyTimeOffset || 0;
    timeOffset.setMinutes( timeOffset.getMinutes() - buyTimeOffset );
    const isOffset = new Date() > timeOffset;
    
    const formatTime = format( new Date(eventItem.start), 'HH:mm' );

    return (
      <li key={eventItem._key} title={`${formatDate} в ${formatTime}`} className = 'grid-list__item'>
          <input
            type="radio"
            className = 'btn-radio'
            name={ eventGroup }
            value={ eventItem._key }
            checked={ isOffset ? false : time ? time === eventItem._key : !index }
            onChange={ e => _setTime( e.target.value ) }
            id={ eventItem._key }
            disabled={isOffset}
          />
          <label className = 'btn-radio__label' htmlFor = { eventItem._key }>
            {isOffset ? `Продажа на ${ formatTime } уже недоступна` : formatTime}
          </label>
      </li>
    );
  } ) : [];

  return (
    <div>
      <span className = 'caption'>Выберите время отправления</span>
      {
        <ul className='grid-list'>
          {renderTimes}
        </ul>
      }
    </div>
  );
};
