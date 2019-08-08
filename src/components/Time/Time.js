import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import { format } from 'date-fns';
import { api } from "../../api";


export const Time = ({ cartKey, productId }) => {
  const { dispatch, event, order } = useStoreon( 'product', 'event', 'order' );
  const [{ direction, date, event: selectedEvent }] = order[ cartKey ].options;
  const [ time, _setTime ] = useState( selectedEvent );

  useEffect(() => {
    const getTimes = async ( direction, date ) => {
      const formatDate = format( typeof date === 'string' ? new Date(date) : date, 'yyyy-MM-dd', new Date() );
      const times = await api.product.getProductTime(productId, direction, formatDate);
      if(!times.length) return;

      _setTime(times[0]._key);

      dispatch('event/add', { [`${productId}.${direction}.${formatDate}`]: times });
    }

    getTimes(direction, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, date]);

  useEffect(() => {
    order[cartKey].options.event = time;
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  const formatDate = format( typeof date === 'string' ? new Date(date) : date, 'yyyy-MM-dd' );
  const eventGroup = `${productId}.${direction}.${formatDate}`;
  const events = event[eventGroup];
  const renderTimes = events ? events.map((eventItem, index) => {
    const formatTime = format( new Date(eventItem.start), 'HH:mm' );

    return (
      <li key={eventItem._key} title={`${formatDate} в ${formatTime}`} className = 'grid-list__item'>
          <input
            type="radio"
            className = 'btn-radio'
            name={ eventGroup }
            value={ eventItem._key }
            checked={ time ? time === eventItem._key : !index }
            onChange={ e => _setTime( e.target.value ) }
            id = { eventItem._key }
          />
          <label className = 'btn-radio__label' htmlFor = { eventItem._key }>
            {formatTime}
          </label>
      </li>
    );
  } ) : [];

  return (
    <div>
      <span className = 'caption'>Выберите время отправления</span>
      {
        renderTimes && renderTimes.length &&
        <ul className='grid-list'>
          {renderTimes}
        </ul>
      }
    </div>
  );
};
