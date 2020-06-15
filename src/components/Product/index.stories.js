import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ProductViewSelect, ProductViewPreview, ProductViewLoading } from "../Product/_view";
import './Product.css';
import './Tickets/Tickets.css';
import '../App/App.css';
import ProductReadme from './README.md';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import data from './data.json';

const singleDirectionProduct = data.singleDirectionProduct;
const singleDirectionProductAndEmptySchedule = data.singleDirectionProductAndEmptySchedule;
const biDirectionalProduct = data.biDirectionalProduct;
const options = data.options;
const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <div className='story-container' style={{ maxWidth: '375px', padding: '20px' }}>{ children }</div>
  </I18nextProvider>
);

storiesOf('Product', module)
  .addParameters({
    options: {
      theme: {} // this is just a workaround for addon-readme
    },
    readme: {
      sidebar: ProductReadme,
    },
  })
  .add('Одиночное направление c расписанием', () => (
    <Wrapper>
      <ProductViewSelect product={singleDirectionProduct} options={options}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Одиночное направление без расписания', () => (
    <Wrapper>
      <ProductViewSelect product={singleDirectionProductAndEmptySchedule} options={options}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление', () => (
    <Wrapper>
      <ProductViewSelect product={biDirectionalProduct} options={options} onChange={() => {}}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление с пустым одиночным', () => (
    <Wrapper>
      <ProductViewSelect product={biDirectionalProduct} options={options} onChange={() => {}}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление с несовпадающими датами', () => (
    <Wrapper>
      <ProductViewSelect product={biDirectionalProduct} options={options} onChange={() => {}}></ProductViewSelect>
    </Wrapper>
  ));