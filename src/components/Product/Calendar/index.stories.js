import React from 'react';
import { Calendar } from './Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import '../../App/App.css';

export default { title: 'Calendar' };

function generateDates(length) {
  const datesArray = [];
  const start = new Date();
  const end = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  const randomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

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
  <Calendar dates={dates}/>
);