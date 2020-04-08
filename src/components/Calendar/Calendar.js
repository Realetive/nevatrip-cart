import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import useStoreon from 'storeon/react';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

const getNearestDate = ( date = new Intl.DateTimeFormat( { timeZone: process.env.REACT_APP_TIMEZONE } ).format( new Date() ), dates = [] ) => {
  return dates.includes( date ) ? date : dates[ 0 ];
};

export const Calendar = ( { dispatch, order, isRightTranslate, lang, orderOptions, dates } ) => {
  const { t } = useTranslation();
  const [ {
    direction: selectedDirection,
    date: selectedDate,
  } ] = orderOptions;

  const availableDates = dates.map( date => {
    const availableDate = new Date( date );
    const userTimeOffset = availableDate.getTimezoneOffset();
    availableDate.setMinutes(availableDate.getMinutes() + userTimeOffset);

    return availableDate;
  } );

  const [ date, setDate ] = useState( getNearestDate( selectedDate, availableDates ) );

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

  useEffect(() => {
    orderOptions[ 0 ].date = date;
    dispatch('order/update', order );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ date ] );

  useEffect(() => {
    setDate( getNearestDate( date, availableDates ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedDirection ] );

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
          includeDates={ availableDates }
          locale='calendarLocale'
          selected={ date }
          onChange={ date => setDate( date ) }
        />
      </div>
    </>
  );
};
