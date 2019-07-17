import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import useStoreon from 'storeon/react';

import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

registerLocale('ru-RU', ru);

const getNearestDate = ( date = new Date(), dates = [] ) => dates.includes( date ) ? date : dates[ 0 ];

export const Calendar = ({ cartKey, productId }) => {
  const { dispatch, direction, order } = useStoreon( 'direction', 'order' );
  const {
    direction: selectedDirection,
    date: selectedDate
  } = order[ cartKey ].options;
  const availableDates = direction[ `${productId}.${selectedDirection}` ].dates.map( date => fromUnixTime( date ));
  const [ date, setDate ] = useState( getNearestDate(selectedDate, availableDates) );

  useEffect(() => {
    order[cartKey].options.date = date;
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    setDate( getNearestDate(date, availableDates) );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDirection]);

  return (
    <>
      <label>
        <span className = 'caption'>Дата поездки</span>
        <input
          readOnly
          type = 'text'
          value = { format(date, 'dd MMMM yyyy', { locale: ru }) }
          className = 'input input_calendar'
        />
      </label>
      <div className='calendarWrapper'>
        <DatePicker
          inline
          calendarClassName='calendar'
          dateFormat='dd MMMM yyyy'
          includeDates={ availableDates }
          locale='ru-RU'
          selected={ date }
          onChange={ date => setDate(date) }
        />
      </div>
    </>
  );
};
