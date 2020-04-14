import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

export const Calendar = ( props ) => {
  const { t } = useTranslation();
  const { isRightTranslate, lang, dates, onDateChange, selectedDate } = props;
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
    onDateChange(selectedDate);
  }, []);

  return (
    <>
      <label>
        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Дата поездки' ) }</span>
        <input
          readOnly
          type='text'
          value={ createDateValue( selectedDate, lang) }
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
          selected={ selectedDate }
          onChange={ date => onDateChange( date ) }
        />
      </div>
    </>
  );
};
