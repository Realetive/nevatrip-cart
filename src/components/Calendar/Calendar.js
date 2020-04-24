import React, { useState, useEffect } from 'react';
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

const getNearestDate = ( dates = [], date ) => {
  const nearestDate = dates.includes( date ) ? date : dates[ 0 ];

  return nearestDate;
};

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

export const Calendar = ( { isRightTranslate = true, lang = process.env.REACT_APP_DEFAULT_LANG, dates = [], selectedDate, onChange = () => {} } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${Calendar.name} rerender: ${count}`);
  }

  const { t } = useTranslation();
  const includeDates = getAvailableDates( dates );
  const initialDate = getNearestDate( includeDates, selectedDate );
  const [ date, setDate ] = useState( initialDate );
  
  useEffect( () => {
    setDate( initialDate );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dates ] );

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
          selected={ date }
          onChange={ newDate => setDate( newDate ) }
        />
      </div>
    </>
  );
};
