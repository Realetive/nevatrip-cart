import React from 'react';
import { storiesOf } from '@storybook/react';
import { Calendar } from './Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import '../../App/App.css';
import CalendarReadme from './README.md';

// export default { title: 'Calendar' };

function generateDates(length) {
  const datesArray = [];
  const start = new Date();
  const end = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  const randomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    date.setHours('0');
    date.setMinutes('0');
    date.setSeconds('0');

    return date.toString();
  }

  for (let i = 0; i < length; i++) {
    const currentDate = randomDate(start, end);

    if (!datesArray.includes(currentDate)) {
      datesArray.push(currentDate);
    }
  }

  return datesArray.sort(( a, b ) => new Date(a) > new Date(b) ? 1 : -1 );
}
const dates = generateDates(100);

// Переданы рандомные даты без выбранной даты. Если выбранная дата не передана, то будет выбрана дата первая в массиве дат. Массив дат приходит с апи уже отсортированным. СОртировка в корзине уж ене требуется
// export const withDates = () => (
//   <div className='story-container' style={{ maxWidth: '335px' }}>
//     <Calendar dates={dates}/>
//   </div>
// );

const randomNumber = Math.floor(Math.random() * dates.length);
const randomDate = new Date( dates[randomNumber] );

// Переданы рандомные даты с выбранной даты
// export const withDatesAndSelectedDate = () => (
//   <div className='story-container' style={{ maxWidth: '335px' }}>
//     <Calendar dates={dates} selectedDate={randomDate}/>
//   </div>
// );

storiesOf('Calendar', module)
  .addParameters({
    options: {
      theme: {}// this is just a workaround for addon-readme
    },
    readme: {
      sidebar: CalendarReadme,
    },
  })
  .add('withDates', () => (
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
      <Calendar dates={dates}/>
    </div>
  ))
  .add('withDatesAndSelectedDate', () => (
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
      <Calendar dates={dates} selectedDate={randomDate}/>
    </div>
  ));