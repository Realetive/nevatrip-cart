import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import LangContext from "../../App";

export const ProductViewPreview = ( { product, options } ) => {
  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  const title = product.title[ t('locale') ] ? product.title[ t('locale') ].name : 'Unnamed direction';
  const events = options.events || [];
  const direction = product.directions.find( _direction => _direction._key === options.direction );

  const directionTitle = direction._type === 'complex'
    ? direction.nested.map((dir) => {
        const currentDirection = product.directions.find( _direction => _direction._key === dir._key );
        return currentDirection.title[ t('locale') ];
      })
    : direction.title[ t('locale') ] || '';

  /* Функция возвращает время в нужном формате. */
  const renderTime = (date) => {
    if (!date) return;
    return date.toLocaleTimeString( t('locale'), { hour: '2-digit', minute: '2-digit' } );
  };

  /* Функция возвращает дату в нужном формате. */
  const renderDate = (date) => {
    if ( !date ) return;

    const hours = date.getHours();
    const local = {
      'en': 'en-US',
      'de': 'de-DE',
      'cs': 'cs-CS',
      'ru': 'ru-RU',
    };
    const optionsWithoutYear = { day: 'numeric', month: 'long' };
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let newDay = new Date( date );

    /* Если выбранное время находится в промежутке с 21 вечера до 4 часов ночи, то выводится дата в формате "в ночь с... на...". */
    if ( hours > 21) {
      const nextDay = newDay.setDate( date.getDate() + 1 );

      return `${ t( 'В ночь с' ) } 
        ${ new Intl.DateTimeFormat( local[ t('locale') ], optionsWithoutYear ).format( date ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ t('locale') ], options ).format( nextDay ) }`;
    } else if ( hours < 4  || hours === '0') {
      const prevDay = newDay.setDate( date.getDate() - 1 );

      return `${ t( 'В ночь с' ) }
        ${ new Intl.DateTimeFormat( local[ t('locale') ], optionsWithoutYear ).format( prevDay ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ t('locale') ], options ).format( date ) }`;
    } else {
      return new Intl.DateTimeFormat( local[ t('locale') ], options ).format( date );
    }
  };

  /* Функция выводит выбранные билеты, их количество и цену. */
  const renderTicket = () => {
    return direction.tickets.map( ( { _key, price, ticket } ) => {
      const count = options.tickets[ _key ];

      if ( !count ) return null;

      const [ { title } ] = ticket;

      return (
        <li key={ _key } className='listPreviewTicketsLi'>
          <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ title[ t('locale') ] }: </span>
          <span dangerouslySetInnerHTML={{__html: `${price}&nbsp;${t( 'currency' )} × ${count} = ${count * price}&nbsp;${t( 'currency' )}`}} />
        </li>
      );
    } )
  };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className={ 'listPreviewLegend' + ( isRightTranslate ? '' : ' translate' ) }>{ title }</legend>
        { events && events.map(( event = {}, index ) => {
          const selectedTime = ( event || {} ).start;

          return event._key && (
            <ul className='listPreviewData' key={ index }>
              <li className='listPreviewDataLi'>
                <div className='listPreviewDataLi'>
                  <div className={'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate')}>
                    <b>{ t('дата') }</b>
                  </div>
                  <div className="listPreviewDataLi__p">{ renderDate(selectedTime) }</div>
                </div>

                <div className='listPreviewDataLi'>
                  <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
                    <b>{ t( 'время' ) }</b>
                  </div>
                  <div className="listPreviewDataLi__p">
                    { renderTime( selectedTime ) }
                  </div>
                </div>
              </li>
              <li className='listPreviewDataLi'>
                <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
                  <b>{ t( 'направление' ) }</b>
                </div>
                <div className="listPreviewDataLi__p">
                  { directionTitle }
                </div>
              </li>
            </ul>
          )}) }

      { options.tickets && direction.dates && direction.dates.length !== 0
       ? <div className='listPreviewTickets'>
          <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
            <b>{ t( 'тип билета' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">
            { renderTicket() }
          </div>
        </div>
      : <p>Пока нет выбранных билетов.</p>
      }
    </fieldset>
  );
}