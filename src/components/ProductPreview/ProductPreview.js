import React from 'react';
import useStoreon from 'storeon/react';
import { useTranslation } from 'react-i18next';

export const ProductPreview = ({ lang, isRightTranslate, product }) => {
  const { t } = useTranslation();
  const {
    title = 'title',
    selectedTime,
  } = product;

  const renderTime = (date) => {
    if (!date) return;
    return date.toLocaleTimeString(lang, { timeStyle: 'short' });
  };

  const renderDate = (date) => {
    console.log(date)
    if ( !date ) return;

    const hours = date.getHours();
    const local = {
      'en': 'en-US',
      'de': 'de-DE',
      'cs': 'cs-CS',
      'ru': 'ru-RU'
    };
    let options = { day: 'numeric', month: 'long' };

    if ( hours > 21) {
      return `${ t( 'В ночь с' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date.setDate( date.getDate() ) + 86400000 ) }`; // TODO getDay
     } else if ( hours < 4  || hours === '0') {
      return `${ t( 'В ночь с' ) }
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date.setDate( date.getDate() ) - 86400000 ) } 
        ${ t( 'на' ) } 
        ${ new Intl.DateTimeFormat( local[ lang ], options ).format( date ) }`;
    } else {
      options = { year: 'numeric', month: 'long', day: 'numeric' };

      return new Intl.DateTimeFormat( local[ lang ], options ).format( date );
    }
  };

  // const renderTicket = () => {
  //   return Object.keys(tickets).map(ticketKey => {
  //     const count = tickets[ticketKey];
  //     const ticketItemKey = `${productId}.${selectedDirectionId}.${ticketKey}`;
  //
  //     if (!count || !ticket[ticketItemKey]) return null;
  //
  //     const {
  //       _key,
  //       price
  //     } = ticket[ticketItemKey];
  //     const name = (ticket[ ticketItemKey ].name || {})[lang] || ticket[ ticketItemKey ].ticket[0].title[lang];
  //
  //     return (
  //       <li key={ _key } className='listPreviewTicketsLi'>
  //         <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ name }: </span>
  //         <span dangerouslySetInnerHTML={{__html: `${price}&nbsp;${t( 'currency' )} × ${count} = ${count * price}&nbsp;${t( 'currency' )}`}} />
  //       </li>
  //     );
  //   } )
  // };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className={ 'listPreviewLegend' + ( isRightTranslate ? '' : ' translate' ) }>{ title }</legend>
      <ul className='listPreviewData'>
        {selectedTime && ( <>
          <li className='listPreviewDataLi'>
            <div className={'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate')}>
              <b>{t('дата')}</b>
            </div>
            <div className="listPreviewDataLi__p">{renderDate(selectedTime.currentDate)}</div>
          </li>

          <li className='listPreviewDataLi'>
            <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
              <b>{ t( 'время' ) }</b>
            </div>
            <div className="listPreviewDataLi__p">
              { renderTime( selectedTime.currentDate ) }
            </div>
          </li>
        </> ) }

        {/*<li className='listPreviewDataLi'>*/}
        {/*  <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>*/}
        {/*    <b>направление</b>&nbsp;/&nbsp;<span className="text_en">direction</span>*/}
        {/*  </div>*/}
        {/*  <div className="listPreviewDataLi__p">*/}
        {/*    { ( selectedDirection || {}).title[lang] || '' }*/}
        {/*  </div>*/}
        {/*</li>*/}
      </ul>
      {/*{ tickets &&*/}
      {/*<div className='listPreviewTickets'>*/}
      {/*  <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>*/}
      {/*    <b>{ t( 'билеты' ) }</b>*/}
      {/*  </div>*/}
      {/*  <div className="listPreviewDataLi__p">*/}
      {/*    { renderTicket() }*/}
      {/*  </div>*/}
      {/*</div> }*/}
    </fieldset>
  );
};
