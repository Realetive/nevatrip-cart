import React  from 'react';
import { useTranslation } from "react-i18next";

export const ProductViewPreview = ( { lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate, product, options } ) => {
  const { t } = useTranslation();
  const title = product.title[ lang ] ? product.title[ lang ].name : 'Unnamed direction';
  const selectedTime = ( options.event || {} ).start ;

  /* Функция возвращает время в нужном формате. */
  const renderTime = (date) => {
    if (!date) return;
    return date.toLocaleTimeString( lang, { hour: '2-digit', minute: '2-digit' } );
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
        ${ new Intl.DateTimeFormat( local[ lang ], optionsWithoutYear ).format( date ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( nextDay ) }`;
    } else if ( hours < 4  || hours === '0') {
      const prevDay = newDay.setDate( date.getDate() - 1 );

      return `${ t( 'В ночь с' ) }
        ${ new Intl.DateTimeFormat( local[ lang ], optionsWithoutYear ).format( prevDay ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date ) }`;
    } else {
      return new Intl.DateTimeFormat( local[ lang ], options ).format( date );
    }
  };

  /* Функция выводит выбранные билеты, их количество и цену. */
  const renderTicket = () => {
    return options.tickets.map( ticket => {
      const count = ticket.count;

      if (!count || !ticket) return null;

      const {
        _key,
        price
      } = ticket;
      const [{ title }] = ticket.ticket;

      return (
        <li key={ _key } className='listPreviewTicketsLi'>
          <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ title[ lang ] }: </span>
          <span dangerouslySetInnerHTML={{__html: `${price}&nbsp;${t( 'currency' )} × ${count} = ${count * price}&nbsp;${t( 'currency' )}`}} />
        </li>
      );
    } )
  };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className={ 'listPreviewLegend' + ( isRightTranslate ? '' : ' translate' ) }>{ title }</legend>
      <ul className='listPreviewData'>
        { selectedTime && ( <>
          <li className='listPreviewDataLi'>
            <div className={'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate')}>
              <b>{ t('дата') }</b>
            </div>
            <div className="listPreviewDataLi__p">{ renderDate(selectedTime) }</div>
          </li>

          <li className='listPreviewDataLi'>
            <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
              <b>{ t( 'время' ) }</b>
            </div>
            <div className="listPreviewDataLi__p">
              { renderTime( selectedTime ) }
            </div>
          </li>
        </> ) }

        <li className='listPreviewDataLi'>
          <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
            <b>{ t( 'направление' ) }</b>
          </div>
          <div className="listPreviewDataLi__p">
            { ( options.direction || {}).title[lang] || '' }
          </div>
        </li>
      </ul>
      { options.tickets &&
      <div className='listPreviewTickets'>
        <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
          <b>{ t( 'билеты' ) }</b>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div>
      }
    </fieldset>
  );
}