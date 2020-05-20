import React from 'react';
import { Calendar } from './Calendar';

export default { title: 'Calendar' };

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function fn(start, end) {
  const datesArray = [];

  for (let i = start; i < end; i++) {
    datesArray.push(randomDate( new Date(), new Date(2021, 0, 1)));
  }

  return datesArray;
}
const dates = fn(1, 100);

export const withDates = () => (
  <Calendar dates={dates}>Hello Button</Calendar>
);