import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';

const moment = require('moment-timezone');
require( 'moment/locale/ru' );
const tripTimeZone = 'Europe/Moscow';

export const ProductPreview = ({ cartKey, productId }) => {
  const { product, order, direction, ticket } = useStoreon( 'product', 'order', 'direction', 'ticket' );
  const title = product[productId].title.ru.name;
  const [{
    direction: selectedDirectionId,
    date,
    event: selectedEvent,
    tickets,
    isOpenTime,
    schedule = [],
  }] = order[cartKey].options || [{}];
  const [time, setTime] = useState();
  const selectedDirection = `${productId}.${selectedDirectionId}`;
  const theEvent = selectedEvent && selectedEvent.start;

  useEffect(() => {
    if (isOpenTime) {
      setTime( schedule.filter( time => time.allDay === true ).map( time => moment(time.start).tz(tripTimeZone).format("LT") ).join(', ') );
    } else {
      setTime( theEvent ? moment(theEvent).tz(tripTimeZone).format("LT") : '' );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent])
  
  if (!selectedDirectionId) return null;

  const renderDate = () => {
    if ( !selectedEvent || !selectedEvent.start ) return;
    const selectedDate = moment( moment( selectedEvent.start ).tz( tripTimeZone ).format( "YYYY-MM-DD LT:ss" )).toDate();

    const hours = moment( selectedDate ).format( "LT" ).substr(0, 2);

    if ( hours > 21) {
      return `В ночь с ${ moment( selectedDate ).format( "D MMMM YYYY" ) } на ${ moment( selectedDate.setDate( selectedDate.getDate() ) + 86400000 ).format( "D MMMM YYYY" ) }`;
    } else if ( hours < 4  || hours === '0:') {
      return `В ночь с ${ moment( selectedDate.setDate( selectedDate.getDate() ) - 86400000 ).format( "D MMMM YYYY" ) } на ${ moment( selectedDate ).format( "D MMMM YYYY" ) }`;
    } else {
      return moment( selectedDate ).format( "D MMMM YYYY" )
    }
  }

  const renderTicket = () => {
    return Object.keys(tickets).map(ticketKey => {
      const count = tickets[ticketKey];

      if (!count || !ticket[`${productId}.${selectedDirectionId}.${ticketKey}`]) return null;

      const {
        _key,
        name,
        price
      } = ticket[`${productId}.${selectedDirectionId}.${ticketKey}`];

      return (
        <li key={ _key } className='listPreviewTicketsLi'>
          <div dangerouslySetInnerHTML={{__html: `${name}: ${price}&nbsp;₽ × ${count} = ${count * price}&nbsp;₽`}} />
        </li>
      );
    } )
  }

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className='listPreviewLegend'>{title}</legend>
      <ul className='listPreviewData'>
        { date && <li className='listPreviewDataLi'>
          <div className="listPreviewDataLi__h">
            <b>дата</b>&nbsp;/&nbsp;<span className="text_en">date</span>
          </div>
          <div className="listPreviewDataLi__p">{ renderDate() }</div>
        </li> }

        { selectedEvent && <li className='listPreviewDataLi'>
          <div className="listPreviewDataLi__h">
            <b>время</b>&nbsp;/&nbsp;<span className="text_en">time</span>
          </div>
          <div className="listPreviewDataLi__p">
            { time }
          </div>
        </li> }

        { product[productId].directions.length > 1 && selectedDirectionId && direction[selectedDirection] && <li className='listPreviewDataLi'>
          <div className="listPreviewDataLi__h">
            <b>направление</b>&nbsp;/&nbsp;<span className="text_en">direction</span>
          </div>
          <div className="listPreviewDataLi__p">
            { direction[selectedDirection].title }
          </div>
        </li> }
      </ul>
      { tickets &&
      <div className='listPreviewTickets'>
        <div className="listPreviewDataLi__h">
          <b>билеты</b>&nbsp;/&nbsp;<span className="text_en">tickets</span>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div> }
    </fieldset>
  );
};
