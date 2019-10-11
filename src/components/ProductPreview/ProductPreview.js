import React from 'react';
import useStoreon from 'storeon/react';
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';
import { convertTime, generateNightWarning } from '../Time/Time';

export const ProductPreview = ({ cartKey, productId }) => {
  const { product, order, direction, ticket } = useStoreon( 'product', 'order', 'direction', 'ticket' );
  const title = product[productId].title.ru.name;
  const [{
    direction: selectedDirectionId,
    date,
    event: selectedEvent,
    tickets
  }] = order[cartKey].options || [{}];

  const theEvent = selectedEvent && selectedEvent.start;

  const renderTime = () => {
    return theEvent ? convertTime( theEvent, 'time' ) : '';
  }

  const renderDate = () => {
    if (!selectedEvent || !selectedEvent.start) return;
    const selectedDate = new Date(selectedEvent.start);

    const hours = convertTime( selectedDate, 'hour' );

    console.log(hours);

    //return generateNightWarning( hours, convertTime( selectedDate, 'dateRu' ));

    if (hours > 2 && hours < 22) {
      return convertTime(selectedDate, 'dateRu');
    } else {
      const prevDate = new Date(selectedDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const dateFrom = format(prevDate, prevDate.getMonth() === selectedDate.getMonth() ? 'dd' : 'dd MMMM', { locale: ru });
      return `в ночь с ${dateFrom} на ${ format(selectedDate, 'dd MMMM', { locale: ru }) }`
    }
  }

  const selectedDirection = `${productId}.${selectedDirectionId}`;

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
          <b>билеты</b>&nbsp;/&nbsp;<span className="text_en">tickets</span>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div> }
    </fieldset>
  );
};
