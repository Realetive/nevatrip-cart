import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LangContext from '../../App';

export const Time = ( { times: { status, payload: times }, selectedTime, direction, onChange = () => {} } ) => {
  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  
  if ( !selectedTime ) return null;

  /* Если на выбранную дату пришел пустой массив с временем, то выводится текст, указывающий, что нет прогулок. */
  if ( status === 'loaded' && !times.length ) {
    return (
      <div className={ 'cart__error' + ( isRightTranslate ? '' : ' translate' ) }>
        { t( 'На выбранную вами дату нет прогулок' ) }
      </div>
    );
  }

  const name = direction._key;
  
  return (
    <>
      {/*{*/}
      {/*    userTimeOffset !== tripTimeZoneOffset &&*/}
      {/*    <div className='caption' style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e8b0c5' }}>*/}
      {/*        { checkLanguage( formatOffset(userTimeOffset) ) }*/}
      {/*    </div>*/}
      {/*}*/}
      <div className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>
        { t( 'Выберите время отправления' ) } { direction?.title[ t( 'locale' ) ] }
      </div>
      <ul className='grid-list'>
        {
          status === 'loading' && (
            <li title={ t( 'Загружаем билеты…' ) } className='grid-list__item'>
              <label className='btn-radio__label btn-radio__label_disabled'>
                Загрузка…
              </label>
            </li>
          )
        }
        { status === 'loaded' && times.map( time => {
          const date = new Date( time.start );
          const formatTime = date.toLocaleTimeString( t( 'locale' ), { hour: '2-digit', minute: '2-digit' } );
          const formatDate = date.toLocaleDateString( t( 'locale' ), { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } );
          const checked = time._key === selectedTime._key && !time.expired;

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
                  onChange={ () => onChange( time, direction._key ) }
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
