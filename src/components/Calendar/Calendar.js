import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

export const Calendar = ( { isRightTranslate, lang, dates, onDateChange, selectedDate } ) => { // selectedDate - срока
  const { t } = useTranslation();
  const [ date, setDate ] = useState( new Date(selectedDate) );
  const createDateValue = ( date, lang = 'en' ) => {
    const local = {
      'en': 'en-US',
      'de': 'de-DE',
      'cs': 'cs-CS',
      'ru': 'ru-RU'
    };
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return new Intl.DateTimeFormat( local[ lang ], options ).format( date );
  };

  useEffect( () => {
    onDateChange( date );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ date ] );

  return (
    <>
      <label>
        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Дата поездки' ) }</span>
        <input
          readOnly
          type='text'
          value={ createDateValue( date, lang) }
          className='input input_calendar'
        />
      </label>
      <div className='calendarWrapper'>
        <DatePicker
          inline
          calendarClassName='calendar'
          dateFormat='dd MMMM yyyy'
          includeDates={ dates }
          locale='calendarLocale'
          selected={ date }
          onChange={ date => setDate( date ) }
        />
      </div>
    </>
  );
};
