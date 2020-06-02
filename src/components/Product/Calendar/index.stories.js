import React from 'react';
import { storiesOf } from '@storybook/react';
import { Calendar } from './Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import '../../App/App.css';
// import CalendarReadme from './README.md';

function generateDates(length, timeStr) {
  const time = timeStr === 'future' && 1 || timeStr === 'past' && -1;
  const datesArray = [];
  const start = new Date();
  const end = new Date(new Date().setFullYear(new Date().getFullYear() + time));

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

const futureDates = generateDates(100, 'future');
const pastDates = generateDates(100, 'past');
const randomNumber = Math.floor(Math.random() * futureDates.length);
const randomDate = new Date( futureDates[randomNumber] );

storiesOf('Календарь', module)
  .addParameters({
    options: {
      theme: {} // this is just a workaround for addon-readme
    },
  })
  .add('С датами', () => (
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
      <Calendar dates={ futureDates }/>
    </div>
  ), {
    readme: {
      sidebar: 'Переданы рандомные даты без выбранной даты. Если выбранная дата не передана, то будет выбрана дата первая в массиве дат. Массив дат приходит с апи уже отсортированным. Сjртировка в корзине ужe не требуется',
    },
  })
  .add('С прошедшими датами', () => (
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
      <Calendar dates={pastDates}/>
    </div>
  ), {
    readme: {
      sidebar: 'Переданы рандомные даты с выбранной даты',
    },
  })
  .add('С выбранной активной датой', () => (
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
      <Calendar dates={futureDates} selectedDate={randomDate}/>
    </div>
  ),
    {
      readme: {
        sidebar: 'CalendarReadme',
      },
    });