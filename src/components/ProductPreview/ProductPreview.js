import React from 'react';
import useStoreon from 'storeon/react';
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';

export const ProductPreview = ({ cartKey, productId }) => {
  const { product, order, event, direction, ticket } = useStoreon( 'product', 'order', 'event', 'direction', 'ticket' );
  const title = product[productId].title.ru.name;
  const {
    direction: selectedDirectionId,
    date,
    event: selectedEvent,
    tickets
  } = order[cartKey].options || {};
  const selectedDate = new Date(date);

  const renderDate = () => format( selectedDate, 'dd MMMM yyyy', { locale: ru });

  const renderTime = () => {
    const formatedDate = format( selectedDate, 'yyyy-MM-dd');
    const eventGroup = `${productId}.${selectedDirectionId}.${formatedDate}`;
    if (!event[eventGroup]) return;
    const action = event[eventGroup].find(eventItem => eventItem._key === selectedEvent);
    if (!action) return;
    return format( new Date( action.start ), 'HH:mm' );
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
          <div>
            {`${name}: ${price} ₽ × ${count} = ${count * price} ₽`}
          </div>
        </li>
      );
    } )
  }

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className='listPreviewLegend'>{title}</legend>
      <ul className='listPreviewData'>
        { date && <li className='listPreviewDataLi'>Дата: { renderDate() }</li> }
        { selectedEvent && <li className='listPreviewDataLi'>Время: { renderTime() }</li> }
        { selectedDirectionId && direction[selectedDirection] && <li className='listPreviewDataLi'>Направление: { direction[selectedDirection].title }</li> }
      </ul>
      { tickets && <div className='listPreviewTickets'>Билеты: { renderTicket() }</div> }
    </fieldset>
  );
};
