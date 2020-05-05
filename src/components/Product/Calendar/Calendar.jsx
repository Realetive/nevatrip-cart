import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import LangContext from '../../App';

/* Функция получает массив дат с типами "строка" и возвращает массив дат с типами "дата". */
const getAvailableDates = ( dates = [] ) => {
  return dates.map( date => {
    const availableDate = new Date( date );
    const userTimeOffset = availableDate.getTimezoneOffset();
    availableDate.setMinutes( availableDate.getMinutes() + userTimeOffset );

    return availableDate;
  });
}

/* Функция возвращает первую дату из массива всех дат направления для инициализации календаря и выбранную пользователем дату. */
const getNearestDate = ( dates = [], date ) => {
  const nearestDate = dates.includes( date ) ? date : dates[ 0 ];

  return nearestDate;
};

/* Функция возвращет дату для input выбора даты в нужном формате, в зависимости от языка. */
const createDateValue = ( date, lang = process.env.REACT_APP_DEFAULT_LANG ) => {
  const local = {
    'en': 'en-US',
    'de': 'de-DE',
    'cs': 'cs-CS',
    'ru': 'ru-RU'
  };
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return new Intl.DateTimeFormat( local[ lang ], options ).format( date );
};

let count = 0;

export const Calendar = ( { dates = [], selectedDate, onChange = () => {} } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${Calendar.name} rerender: ${count}`);
  }

  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  const includeDates = getAvailableDates( dates );
  const initialDate = getNearestDate( includeDates, selectedDate );
  const [ date, setDate ] = useState( initialDate );

  /* Подписываемся на изменение массива дат (изменится он при смене пользователем направления) и меняем выбранную дату. */
  useEffect( () => {
    setDate( initialDate );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dates ] );

  /* Подписываемся на смену выбранной даты и отправляем новую дату выше для загрузки времени для новой даты. */
  useEffect( () => {
    if ( date ) {
      onChange( date );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ date ] );

  return (
    <>
      <label>
        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Дата поездки' ) }</span>
        <input
          readOnly
          type='text'
          value={ createDateValue( selectedDate, t( 'locale' ) ) }
          className='input input_calendar'
        />
      </label>
      <div className='calendarWrapper'>
        <DatePicker
          inline
          calendarClassName='calendar'
          dateFormat='dd MMMM yyyy'
          includeDates={ includeDates }
          locale='calendarLocale'
          selected={ date }
          onChange={ newDate => setDate( newDate ) }
        />
      </div>
    </>
  );
};
