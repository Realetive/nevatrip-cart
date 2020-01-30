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
          'Фамилия и имя': 'Last name and first name',
          'E-mail': 'E-mail',
          'Телефон': 'Phone Number',
          'Промокод': 'Promo code',
          'У меня есть промокод': 'I have a promo code',
          'Я согласен': 'I agree to ',
          'условиями покупки': 'the Terms and Conditions and ',
          'политикой': 'Privacy Policy',
          'oferta': 'https://en.nevatrip.ru/oferta',
          'Оплатить': 'Proceed to payment',
          'В ночь с': 'on the night of',
          'на': 'to',
          'дата': 'Date',
          'время': 'Time',
          'билеты': 'Ticket type',
          'Выберите время отправления': 'Select departure time',
          'Выберите категории билетов': 'Select ticket type',
          'Дата поездки': 'Select date',
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
          'условиями покупки': 'условиями покупки и ',
          'политикой': 'политикой конфиденциальности',
          'oferta': 'https://nevatrip.ru/oferta',
          'Оплатить': 'Оплатить',
          'В ночь с': 'В ночь с',
          'на': 'на',
          'дата': 'дата',
          'время': 'время',
          'билеты': 'Тип билета',
          'Выберите время отправления': 'Выберите время отправления',
          'Выберите категории билетов': 'Выберите категории билетов',
          'Дата поездки': 'Выберите дату ',
        }
      },
      de: {
        translation: {
          'Ваш заказ': 'Ihre Bestellung',
          'Фамилия и имя': 'Vorname und Nachname',
          'E-mail': 'E-mail',
          'Телефон': 'Mobilnummer',
          'Промокод': 'Ich habe einen',
          'У меня есть промокод': 'Ich habe einen Gutscheincode',
          'Я согласен': 'Ich stimme ',
          'условиями покупки': 'den Allgemeinen Geschäftsbedingungen und ',
          'политикой': 'den Datenschutzbestimmungen zu',
          'oferta': 'https://nevatrip.ru/oferta',
          'Оплатить': 'Weiter zur Zahlung',
          'В ночь с': 'in der Nacht vom ',
          'на': 'auf den',
          'дата': 'Datum',
          'время': 'Zeit',
          'билеты': 'Ticket-Kategorie',
          'Выберите время отправления': 'Wählen Sie die Abfahrtszeit',
          'Выберите категории билетов': 'Ticketkategorien auswählen',
          'Дата поездки': 'Wählen Sie ein Datum ',
        }
      },
      cz: {
        translation: {
          'Ваш заказ': 'Vaše objednávka',
          'Фамилия и имя': 'Příjmení a jméno',
          'E-mail': 'E-mail',
          'Телефон': 'Telefon',
          'Промокод': 'Propagační kód',
          'У меня есть промокод': 'Mám propagační kód',
          'Я согласен': 'Souhlasím s ',
          'условиями покупки': 'podmínkami a ',
          'политикой': 'zásadami ochrany osobních údajů',
          'oferta': 'https://nevatrip.ru/oferta',
          'Оплатить': 'Zaplatit',
          'В ночь с': 'V noci od',
          'на': 'do',
          'дата': 'Datum',
          'время': 'Čas',
          'билеты': 'Kategorie vstupenek',
          'Выберите время отправления': 'Vyberte čas odjezdu',
          'Выберите категории билетов': 'Vyberte kategorie vstupenek',
          'Дата поездки': 'Vyberte datum',
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
