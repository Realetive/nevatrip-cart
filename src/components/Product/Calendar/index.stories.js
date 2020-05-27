import React from 'react';
import { Calendar } from './Calendar';

export default { title: 'Calendar' };

function generateDates(length) {
  const datesArray = [];
  const now = new Date();
  const start = now;
  const end = new Date(now.setFullYear(now.getFullYear() + 1));
  console.log(now)
  console.log(start)
  console.log(end)

  const randomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    date.setHours('0');
    date.setMinutes('0');
    date.setSeconds('0');

    return date.toString();
  }

  for (let i = 0; i <= length; i++) {
    const currentDate = randomDate(start, end);

    if (!datesArray.includes(currentDate)) {
      datesArray.push(currentDate);
    }
  }

  return datesArray;
}
const dates = generateDates(100);

export const withDates = () => (
  <Calendar dates={dates}>Hello Button</Calendar>
);