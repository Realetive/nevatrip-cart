import React from 'react';
import { useTranslation } from 'react-i18next';

export const Time = ( { isRightTranslate = true, lang = process.env.REACT_APP_DEFAULT_LANG, times = [], selectedTime, onChange = () => {} } ) => {
  const { t } = useTranslation();
  
  if (!times.length) {
    return (<div className={'cart__error' + (isRightTranslate ? '' : ' translate')}>{t('На выбранную дату нет прогулок')}</div>);
  }
  
  const name = times.map( ({ _key }) => _key ).join('-');
  
  return (
    <>
      {/*{*/}
      {/*    userTimeOffset !== tripTimeZoneOffset &&*/}
      {/*    <div className='caption' style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e8b0c5' }}>*/}
      {/*        { checkLanguage( formatOffset(userTimeOffset) ) }*/}
      {/*    </div>*/}
      {/*}*/}
      <div className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Выберите время отправления' ) }</div>
      <ul className='grid-list'>
        { times.map( time => {
          const date = new Date( time.start );
          const formatTime = date.toLocaleTimeString( lang, { timeStyle: 'short' } );
          const formatDate = date.toLocaleDateString( lang, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } );
          // const checked = time._key === selectedTime._key && !time.expired;
          const checked = false;

          return (
            <li key={ time._key }
              title={ time.expired ? t( 'Это время уже не доступно' ) : `${ formatDate }`}
              className='grid-list__item'>
              <label
                className={ `btn-radio__label ${ checked ? 'btn-radio__label_checked' : '' } ${ time.expired ? 'btn-radio__label_disabled' : '' }` }
                >
                { formatTime }
                <input
                  type="radio"
                  className='btn-radio'
                  name={ name }
                  value={ time._key }
                  checked={ checked }
                  onChange={ () => onChange( time ) }
                  id={ time._key }
                  disabled={ time.expired }
                />
              </label>
            </li>
        ) } ) }
      </ul>
    </>
  )
};
