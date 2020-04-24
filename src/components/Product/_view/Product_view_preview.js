import React  from 'react';
import { useTranslation } from "react-i18next";

export const ProductViewPreview = ( { lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate, product, options } ) => {
  const { t } = useTranslation();
  const title = product.title[ lang ] ? product.title[ lang ].name : 'Unnamed direction';
  const selectedTime = ( options.event || {} ).start ;

  const renderTime = (date) => {
    if (!date) return;
    return date.toLocaleTimeString(lang, { timeStyle: 'short' });
  };

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

    if ( hours > 21) {
      return `${ t( 'В ночь с' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], optionsWithoutYear ).format( date ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date.setDate( date.getDate() ) + 86400000 ) }`; // TODO getDay
    } else if ( hours < 4  || hours === '0') {
      return `${ t( 'В ночь с' ) }
        ${ new Intl.DateTimeFormat( local[ lang ], optionsWithoutYear ).format( date.setDate( date.getDate() ) - 86400000 ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date ) }`;
    } else {
      return new Intl.DateTimeFormat( local[ lang ], options ).format( date );
    }
  };

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
      {/*{ tickets &&*/}
      <div className='listPreviewTickets'>
        <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
          <b>{ t( 'билеты' ) }</b>
        </div>
        <div className="listPreviewDataLi__p">
          { renderTicket() }
        </div>
      </div>
      {/*}*/}
      {/*<pre>*/}
      {/*  <code>*/}
      {/*    {*/}
      {/*      JSON.stringify( options, null, 2 )*/}
      {/*    }*/}
      {/*  </code>*/}
      {/*</pre>*/}
    </fieldset>
  );
}