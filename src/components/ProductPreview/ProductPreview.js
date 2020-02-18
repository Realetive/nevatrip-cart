import React from 'react';
import useStoreon from 'storeon/react';
import { useTranslation } from 'react-i18next';

const moment = require( 'moment-timezone' );
const tripTimeZone = 'Europe/Moscow';

export const ProductPreview = ({ cartKey, productId }) => {
  const { t } = useTranslation();
  const { product, order, direction, ticket } = useStoreon( 'product', 'order', 'direction', 'ticket' );
  const title = product[productId].title;
  const [{
    direction: selectedDirectionId,
    date,
    event: selectedEvent,
    tickets
  }] = order[cartKey].options || [{}];

  const theEvent = selectedEvent && selectedEvent.start;

  const renderTime = () => {
    return theEvent ? moment( theEvent ).tz( tripTimeZone ).format( "LT" ) : '';
  };

  const renderDate = () => {
    if ( !selectedEvent || !selectedEvent.start ) return;
    const selectedDate = moment( selectedEvent.start ).tz( tripTimeZone );
    const hours = moment( selectedDate ).format( "LT" ).substr(0, 2);

    if ( hours > 21) {
      return `${ t( 'В ночь с' ) } ${ moment( selectedDate ).format( "D MMMM" ) } ${ t( 'на' ) } ${ moment( selectedDate.setDate( selectedDate.getDate() ) + 86400000 ).format( "D MMMM" ) }`;
    } else if ( hours < 4  || hours === '0:') {
      return `${ t( 'В ночь с' ) } ${ moment( selectedDate.setDate( selectedDate.getDate() ) - 86400000 ).format( "D MMMM" ) } ${ t( 'на' ) } ${ moment( selectedDate ).format( "D MMMM" ) }`;
    } else {
      return moment( selectedDate ).format( "D MMMM" )
    }
  };

  const selectedDirection = `${productId}.${selectedDirectionId}`;

  const renderTicket = () => {
    return Object.keys(tickets).map(ticketKey => {
      const count = tickets[ticketKey];

      if (!count || !ticket[`${productId}.${selectedDirectionId}.${ticketKey}`]) return null;

      const countOfTickets = Object.values(tickets).reduce((sum, item) => {
              return sum + (item !== undefined ? item : 0);
      }, 0);
      // console.log(order);
      // console.log(tickets);
      // console.log('product' + countOfTickets);

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
  };

  const submitForm = () => {

  };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className='listPreviewLegend'>{title}</legend>
      <ul className='listPreviewData'>
        { date && <li className='listPreviewDataLi'>
          <div className="listPreviewDataLi__h">
            <b>{ t( 'дата' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">{ renderDate() }</div>
        </li> }

        { selectedEvent && <li className='listPreviewDataLi'>
          <div className="listPreviewDataLi__h">
            <b>{ t( 'время' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">
            { renderTime() }
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
          <b>{ t( 'билеты' ) }</b>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div> }
    </fieldset>
  );
};
