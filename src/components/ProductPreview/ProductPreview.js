import React from 'react';
import useStoreon from 'storeon/react';
import { useTranslation } from 'react-i18next';

export const ProductPreview = ({ cartKey, productId, lang, isRightTranslate }) => {
  const { t } = useTranslation();
  const { product, order, direction, ticket = {} } = useStoreon( 'product', 'order', 'direction', 'ticket' );
  const title = product[productId].title;
  const [{
    direction: selectedDirectionId,
    date,
    event: selectedEvent,
    tickets
  }] = order[cartKey].options || [{}];

  const theEvent = ( selectedEvent || {} ).start;
  const timeInUTC = new Date( ( selectedEvent || {} ).start );
  const userTimeOffset = timeInUTC.getTimezoneOffset();

  timeInUTC.setMinutes(timeInUTC.getMinutes() + userTimeOffset - ( selectedEvent || {} ).timeOffset);

  const renderTime = () => {
    return theEvent ? timeInUTC.toLocaleTimeString(lang, { timeStyle: 'short' }) : '';
  };

  const renderDate = () => {
    if ( !selectedEvent || !selectedEvent.start ) return;

    const hours = timeInUTC.getHours();
    let options = { day: 'numeric', month: 'long' };

    if ( hours > 21) {
      return `${ t( 'В ночь с' ) } 
        ${ new Intl.DateTimeFormat( 'ru-RU', options ).format( timeInUTC ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( 'ru-RU', options ).format( timeInUTC.setDate( timeInUTC.getDate() ) + 86400000 ) }`;
    } else if ( hours < 4  || hours === '0') {
      return `${ t( 'В ночь с' ) }
        ${ new Intl.DateTimeFormat( 'ru-RU', options ).format( timeInUTC.setDate( timeInUTC.getDate() ) - 86400000 ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( 'ru-RU', options ).format( timeInUTC ) }`;
    } else {
      options = { year: 'numeric', month: 'long', day: 'numeric' };

      return new Intl.DateTimeFormat( 'ru-RU', options ).format( timeInUTC );
    }
  };

  const selectedDirection = `${productId}.${selectedDirectionId}`;

  const renderTicket = () => {
    return Object.keys(tickets).map(ticketKey => {
      const count = tickets[ticketKey];
      const ticketItemKey = `${productId}.${selectedDirectionId}.${ticketKey}`;

      if (!count || !ticket[ticketItemKey]) return null;

      const {
        _key,
        price
      } = ticket[ticketItemKey];
      const name = (ticket[ ticketItemKey ].name || {})[lang] || ticket[ ticketItemKey ].ticket[0].title[lang];

      return (
        <li key={ _key } className='listPreviewTicketsLi'>
          <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ name }: </span>
          <span dangerouslySetInnerHTML={{__html: `${price}&nbsp;${t( 'currency' )} × ${count} = ${count * price}&nbsp;${t( 'currency' )}`}} />
        </li>
      );
    } )
  };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className={ 'listPreviewLegend' + ( isRightTranslate ? '' : ' translate' ) }>{ (title[lang] || {} ).name }</legend>
      <ul className='listPreviewData'>
        { date && <li className='listPreviewDataLi'>
          <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
            <b>{ t( 'дата' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">{ renderDate() }</div>
        </li> }

        { selectedEvent && <li className='listPreviewDataLi'>
          <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
            <b>{ t( 'время' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">
            { renderTime() }
          </div>
        </li> }

        { product[productId].directions.length > 1 && selectedDirectionId && direction[selectedDirection] && <li className='listPreviewDataLi'>
          <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
            <b>направление</b>&nbsp;/&nbsp;<span className="text_en">direction</span>
          </div>
          <div className="listPreviewDataLi__p">
            { direction[selectedDirection].title }
          </div>
        </li> }
      </ul>
      { tickets &&
      <div className='listPreviewTickets'>
        <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
          <b>{ t( 'билеты' ) }</b>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div> }
    </fieldset>
  );
};
