import React from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

const getAvailableDates = ( dates = [] ) => {
  return dates.map( date => {
    const availableDate = new Date( date );
    const userTimeOffset = availableDate.getTimezoneOffset();
    availableDate.setMinutes( availableDate.getMinutes() + userTimeOffset );

    return availableDate;
  });
}

const getNearestDate = (date, dates = []) => {
  const nearestDate = dates.includes( date ) ? date : dates[ 0 ];

  return nearestDate;
};

export const Calendar = ( { isRightTranslate, lang, dates, onChange, selectedDate } ) => {
  const { t } = useTranslation();
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
  
  const includeDates = getAvailableDates( dates );
  const selected = getNearestDate( selectedDate, includeDates );

  return (
    <>
      <label>
        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Дата поездки' ) }</span>
        <input
          readOnly
          type='text'
          value={ createDateValue( selectedDate, lang ) }
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
          selected={ selected }
          onChange={ date => onChange( date ) }
        />
      </div>
    </>
  );
};
