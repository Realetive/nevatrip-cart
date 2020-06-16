import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { ProductViewSelect } from "./_view";
import './Product.css';
import './Tickets/Tickets.css';
import '../App/App.css';
import ProductReadme from './README.md';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import data from './data.json';
import { select, withKnobs } from "@storybook/addon-knobs";
import { styled } from '@storybook/theming';

const singleDirectionProduct = data.singleDirectionProduct;
const singleDirectionProductAndEmptySchedule = data.singleDirectionProductAndEmptySchedule;
const biDirectionalProduct = data.biDirectionalProduct;
const options = data.options['01e50dd3e7a3'];

const Wrapper = ({ children }) => {
  const label = 'Выберите язык компонента';
  const options = [ 'en', 'ru', 'de', 'cs' ]
  const defaultValue = 'en';
  const groupId = 'GROUP-ID2';
  const value = select( label, options, defaultValue, groupId );

  i18n.changeLanguage(value);

  return (
    <I18nextProvider i18n={ i18n }>
      <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>{ children }</div>
    </I18nextProvider>
  )};

const fn = () => {
  let currentOptions = data.options['01e50dd3e7a3'];
  const [ initial, setInitial ] = useState(currentOptions);

  const onChange = ( direction ) => {
    console.log( direction.direction );
    setInitial(data.options[direction.direction]);
    console.log('currentOptions', currentOptions);
  }

  return { initial, onChange };
};

storiesOf('Product', module)
  .addParameters({
    options: {
      theme: {} // this is just a workaround for addon-readme
    },
    readme: {
      sidebar: ProductReadme,
    },
  })
  .addDecorator(withKnobs)
  .add('Одиночное направление c расписанием', () => (
    <Wrapper>
      <ProductViewSelect product={ singleDirectionProduct } options={ options }></ProductViewSelect>
    </Wrapper>
  ))
  .add('Одиночное направление без расписания', () => (
    <Wrapper>
      <ProductViewSelect product={ singleDirectionProductAndEmptySchedule } options={ options }></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление', () => {
    const { initial, onChange } = fn();

    return (
      <Wrapper>
        <ProductViewSelect product={ biDirectionalProduct } options={ initial } onChange={ onChange }></ProductViewSelect>
      </Wrapper>
  )})
  .add('Составное направление с пустым одиночным', () => {
    const { initial, onChange } = fn();

    return (
      <Wrapper>
        <ProductViewSelect product={ biDirectionalProduct } options={ initial } onChange={ onChange }></ProductViewSelect>
      </Wrapper>
  )})
  .add('Составное направление с несовпадающими датами', () => {
    const { initial, onChange } = fn();

    return (
      <Wrapper>
        <ProductViewSelect product={ biDirectionalProduct } options={ initial } onChange={ onChange }></ProductViewSelect>
      </Wrapper>
  )});