import React from 'react';
import { storiesOf } from '@storybook/react';
import { ProductViewLoading } from './_view/Product_view_loading';
import { ProductViewPreview } from './_view/Product_view_preview';
import { ProductViewSelect } from './_view/Product_view_select';
import './Product.css';
import '../App/App.css';
import ProductReadme from './README.md';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import data from './data.json';

const product = data.product;
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
  .add('Одиночное направление', () => (
    <Wrapper>
      <ProductViewSelect product={product} options={options}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление', () => (
    <Wrapper>
      <ProductViewSelect product={product} options={options}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление с пустым одиночным', () => (
    <Wrapper>
      <ProductViewSelect product={product} options={options}></ProductViewSelect>
    </Wrapper>
  ))
  .add('Составное направление с несовпадающими датами', () => (
    <Wrapper>
      <ProductViewSelect product={product} options={options}></ProductViewSelect>
    </Wrapper>
  ));