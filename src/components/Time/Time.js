import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import { format } from 'date-fns';
import { api } from "../../api";

export const Time = ({ cartKey, productId }) => {
  const { dispatch, event, order, direction: directions } = useStoreon( 'product', 'event', 'order', 'direction' );
  const [{ direction, date, event: selectedEvent }] = order[ cartKey ].options;
  const [ time, setTime ] = useState( selectedEvent );

  useEffect(() => {
    const getTimes = async (direction, date) => {
      const scheduleDate = new Date(date);
      const formatDate = format( scheduleDate, 'yyyy-MM-dd' );
      const times = await api.product.getProductTime(productId, direction, formatDate);

      if (!times.length) return;

      setTime(times[0]._key);
      dispatch('event/add', { [`${productId}.${direction}.${formatDate}`]: times });
    }

    getTimes(direction, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, date]);

  useEffect(() => {
    if (!event) return;
    const scheduleDate = new Date(date);
    const formatDate = format( scheduleDate, 'yyyy-MM-dd' );
    const events = event[`${productId}.${direction}.${formatDate}`] || [];
    const action = events.find(eventItem => eventItem._key === time);

    order[cartKey].options[0].event = action;

    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, event])

  const formatDate = format( new Date(date), 'yyyy-MM-dd' );
  const eventGroup = `${productId}.${direction}.${formatDate}`;
  const events = event[eventGroup];
  const renderTimes = events ? (events || []).map((eventItem, index) => {
    const timeOffset = new Date(eventItem.start)
    const buyTimeOffset = directions[`${productId}.${direction}`].buyTimeOffset || 0;
    timeOffset.setMinutes( timeOffset.getMinutes() - buyTimeOffset );
    const isOffset = new Date() > timeOffset;

    const formatTime = convertTime( eventItem.start, 'time' );

    return (
      <li key={eventItem._key} title={`${formatDate} в ${formatTime}`} className = 'grid-list__item'>
          <input
            type="radio"
            className = 'btn-radio'
            name={ eventGroup }
            value={ eventItem._key }
            checked={ isOffset ? false : time ? time === eventItem._key : !index }
            onChange={ e => setTime( e.target.value ) }
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

export function convertTime( theEvent, format ) {
  if ( theEvent ){
    const browserTimeOffsetTs = ( new Date() ).getTimezoneOffset() * 60;// смещение часового пояса относительно часового пояса UTC в секундах для текущей локали
    const tourTimeOffsetTs = -3*3600;
    const currentTimeOffsetTs = browserTimeOffsetTs - tourTimeOffsetTs;

    function convertTsToDay ( unixtimestamp, lang, type  ) {
      let monthsArr;
      if (lang==='ru'){
        monthsArr = [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ];
      } else {
        monthsArr = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
      }
      const date = new Date( unixtimestamp*1000 + currentTimeOffsetTs );
      const year = date.getFullYear();
      const month = monthsArr[ date.getMonth() ];
      const day = date.getDate();
      let zero = '';
      if ( day<10 ) { zero = '0' }
      if ( lang==='ru' ){
        return `${ day } ${ month }`;
      } else if ( lang==='ru' && type==='month' ){
        return `${ month }`;
      } else {
        return `${ year }-${ month }-${ zero }${ day }`;
      }
    }

    const dateTs = ( new Date( theEvent ) ).getTime() / 1000 + currentTimeOffsetTs; // получить timestamp даты прогулки
    const hour = `0${ ( new Date( dateTs * 1000 ) ).getHours() }`.substr( -2 );// двузначное число часов старта прогулки
    const hoursNum =  `${ ( new Date( dateTs * 1000 ) ).getHours() }`.substr( -2 );// число часов старта прогулки
    const minutes = `0${ ( new Date( dateTs * 1000 ) ).getMinutes() }`.substr( -2 );// двузначное число часов старта прогулки
    const clock = `${ hour }:${ minutes }`;

    const returnTime = convertTsToDay(dateTs) + 'T' + clock + ':00Z';

    //ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS

    console.log( '================================' );

    if ( format === 'time' ) {
      return clock
    } else if ( format === 'dateRu' ) {
      return convertTsToDay( dateTs, 'ru' )
    } else if ( format === 'hour' ) {
      return hoursNum
    } else if ( format === 'ruMonth' ) {
      return convertTsToDay( dateTs, 'ru', 'month' )
    } else {
      return returnTime;
    }
  }
}

export function generateNightWarning(time, date){
  if (time && date){
    function convert(unixtimestamp){
      const months_arr = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
      const date = new Date(unixtimestamp*1000);
      const month = months_arr[date.getMonth()];
      const day = date.getDate();
      return day + ' ' + month;
    }

    let msg;
    let twentyFourHours = 86400;
    let hour = parseInt( time.substr(0, 2) );
    if ( hour>21 ){
      msg = "Прогулка в ночь с "+ convert(date) + " на "+ convert(date + twentyFourHours);
    } else if ( hour < 4 ){
      msg = "Прогулка в ночь с "+ convert(date - twentyFourHours) + " на " + convert(date);
    } else {
      msg = date;
    }
    return msg
  }
}
