import React from 'react';
import { useTranslation } from 'react-i18next';
// import moment from "moment-timezone";

// const tripTimeZone = 'Europe/Prague';
// const tripTimeZoneOffset = - moment.tz(tripTimeZone).utcOffset();
//
// function pad (value) {
//     return value < 10 ? '0' + value : value;
// }
//
// function formatOffset(offset) {
//     const sign = (offset > 0) ? "-" : "+";
//     const _offset = Math.abs(offset);
//     const hours = pad(Math.floor(_offset / 60));
//     const minutes = pad(_offset % 60);
//
//     return sign + hours + ":" + minutes;
// }

export const Time = ( props ) => {
  const { t } = useTranslation();
  const { times, isRightTranslate, lang, onTimeChange } = props;

  return (
    <div>
      {/*{*/}
      {/*    userTimeOffset !== tripTimeZoneOffset &&*/}
      {/*    <div className='caption' style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e8b0c5' }}>*/}
      {/*        { checkLanguage( formatOffset(userTimeOffset) ) }*/}
      {/*    </div>*/}
      {/*}*/}
      <div className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Выберите время отправления' ) }</div>
      <ul className='grid-list'>
        { times.map( date => {
          const formatTime = date.currentDate.toLocaleTimeString( lang, { timeStyle: 'short' } );
          const formatDate = date.currentDate.toLocaleDateString( lang, {year: 'numeric', month: '2-digit', day: '2-digit'} );

          return (
            <li key={ date.key }
              title={ date.isOffset ? t( 'Это время уже не доступно' ) : `${ formatDate } ${ formatTime }`}
              className='grid-list__item'>
              <input
              type="radio"
              className='btn-radio'
              name={ date.inputName }
              value={ date.key }
              checked={ date.checked }
              onChange={ e => onTimeChange( e.target.value ) }
              id={ date.key }
              disabled={ date.isOffset }
              />

              <label
              className={ date.isOffset ? 'btn-radio__label btn-radio__label_disabled' : 'btn-radio__label' }
              htmlFor={ date.key }>
              { formatTime }
              </label>
            </li>
        ) } ) }
      </ul>
    </div>
  );
};
