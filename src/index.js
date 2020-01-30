import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const session = new URL(window.location.href).searchParams.get('session') || 'test-test-test';
const root = document.getElementById('root');
const lang = root.getAttribute('lang');

i18n
  .use( initReactI18next ) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          'Ваш заказ': 'Your order',
          'Фамилия и имя': 'Soname and name',
          'E-mail': 'E-mail',
          'Телефон': 'Phone',
          'Промокод': 'Promocode',
          'У меня есть промокод': 'I have a promocode',
          'Я согласен': 'I agree to the',
          'условиями покупки': 'terms and privacy policy',
          'oferta': 'https://en.nevatrip.ru/oferta',
          'Оплатить': 'Pay',
          'В ночь с': 'At night since',
          'на': 'on',
          'дата': 'date',
          'время': 'time',
          'билеты': 'tickets',
          'Выберите время отправления': 'Choose departure time',
          'Выберите категории билетов': 'Choose tickets',
          'Дата поездки': 'Trip date',
        }
      },
      ru: {
        translation: {
          'Ваш заказ': 'Ваш заказ',
          'Фамилия и имя': 'Фамилия и имя',
          'E-mail': 'E-mail',
          'Телефон': 'Телефон',
          'Промокод': 'Промокод',
          'У меня есть промокод': 'У меня есть промокод',
          'Я согласен': 'Согласен(-на) с',
          'условиями покупки': 'условиями покупки',
          'oferta': 'https://nevatrip.ru/oferta',
          'Оплатить': 'Оплатить',
          'В ночь с': 'В ночь с',
          'на': 'на',
          'дата': 'дата',
          'время': 'время',
          'билеты': 'билеты',
          'Выберите время отправления': 'Выберите время отправления',
          'Выберите категории билетов': 'Выберите категории билетов',
          'Дата поездки': 'Дата поездки',
        }
      },
    },
    lng: lang,
    fallbackLng: 'ru',

    interpolation: {
      escapeValue: false
    }
  });

render(
  <App session={session} lang={lang} />,
  root
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
