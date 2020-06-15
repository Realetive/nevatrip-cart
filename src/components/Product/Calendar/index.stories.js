import React from 'react';
import { storiesOf } from '@storybook/react';
import { Calendar } from './Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import '../../App/App.css';
import CalendarReadme from './README.md';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { styled } from '@storybook/theming'; ///////////
import { withKnobs, select } from '@storybook/addon-knobs';

console.log(i18n)

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

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>{ children }</div>
  </I18nextProvider>
);

const fn = () => {
  return (
    <Wrapper>
      <Calendar dates={ generateDates( 100, 'future', true ) }/>
    </Wrapper>
  );
};

storiesOf( 'Календарь', module )
  .addParameters({
    options: {
      theme: {} // this is just a workaround for addon-readme
    },
    readme: {
      sidebar: CalendarReadme,
    },
  })
  .add( 'С предстоящими датами1', fn)
  .add( 'С предстоящими датами', () => {
      ['ru', 'en', 'de'].map( async current => {
        await i18n.changeLanguage(current)
        array.push(<Calendar dates={generateDates(100, 'future', true)}/>)
      })

    const label = 'Выберите язык компонента';
    const options = ['en', 'ru', 'de', 'cs']
    const defaultValue = 'en';
    const groupId = 'GROUP-ID2';
    const value = select(label, options, defaultValue, groupId);
    i18n.changeLanguage(value)
    return (
      <>
        <I18nextProvider i18n={i18n}>
          <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>
            <Calendar dates={generateDates(100, 'future', true)}/>
          </div>
        </I18nextProvider>
      </>
    )
  })
  .addDecorator(withKnobs)
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