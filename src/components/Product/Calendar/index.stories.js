import React from 'react';
import { storiesOf } from '@storybook/react';
import { Calendar } from './Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import '../../App/App.css';
import CalendarReadme from './README.md';

const generateDates = ( length, timeStr = 'future', isSort = true ) => {
  const time = ( timeStr === 'future' && 1 ) || ( timeStr === 'past' && -1 );
  const datesArray = [];
  const start = new Date();
  const end = new Date( new Date().setFullYear( new Date().getFullYear() + time ) );

  const randomDate = ( start, end ) => {
    const date = new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) );
    date.setHours( '0' );
    date.setMinutes( '0' );
    date.setSeconds( '0' );

    return date.toString();
  }

  for ( let i = 0; i < length; i++ ) {
    const currentDate = randomDate( start, end );

    if ( !datesArray.includes( currentDate ) ) {
      datesArray.push( currentDate );
    }
  }

  return isSort
    ? datesArray.sort(( a, b ) => new Date(a) > new Date(b) ? 1 : -1 )
    : datesArray;
};

const Wrapper = ({ children }) => <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>{ children }</div>;

storiesOf( 'Календарь', module )
  .addParameters({
    options: {
      theme: {} // this is just a workaround for addon-readme
    },
    readme: {
      sidebar: CalendarReadme,
    },
  })
  .add( 'С предстоящими датами', () => (
    <Wrapper>
      <Calendar dates={ generateDates( 100, 'future', true ) }/>
    </Wrapper>
  ))
  .add( 'С прошедшими датами', () => (
    <Wrapper>
      <Calendar dates={ generateDates( 100, 'past', true ) }/>
    </Wrapper>
  ))
  .add( 'С неотсортированными датами', () => (
    <Wrapper>
      <Calendar dates={ generateDates( 100, 'future', false ) }/>
    </Wrapper>
  ));