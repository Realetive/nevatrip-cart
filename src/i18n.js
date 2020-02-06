import _i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { registerLocale } from 'react-datepicker';
import moment from "moment-timezone";

export default function i18n(lang) {
  _i18n
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
            'date_format': 'm/d/yyyy',
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
            'Дата поездки': 'Выберите дату',
            'date_format': 'dd.mm.yyyy',
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
            'Дата поездки': 'Wählen Sie ein Datum',
            'date_format': 'yyyy-mm-dd',
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
            'Я согласен': 'Souhlasím s',
            'условиями покупки': 'podmínkami a',
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
            'date_format': 'd. m. yyyy',
          }
        },
      },
      lng: lang,
      fallbackLng: 'ru',

      interpolation: {
        escapeValue: false
      }
    });

  const calendarLocaleObject = {
    'ru': 'ru',
    'en': 'en-US',
    'de': 'de',
    'cz': 'cs',
  };
  const calendarLocaleKey = calendarLocaleObject[ _i18n.language ];
  const calendarLocale = require( `date-fns/locale/${ calendarLocaleKey }` );
  registerLocale('calendarLocale', calendarLocale.default );

  const momentLocaleObject = {
    'ru': 'ru',
    'en': 'en',
    'de': 'de',
    'cz': 'cs',
  };
  const momentLocaleKey = momentLocaleObject[_i18n.language];
  if (_i18n.language !== 'en') {
    require( `moment/locale/${ momentLocaleKey }` )
  }
  console.log( 'momentLocaleKey', momentLocaleKey );
  moment.locale( momentLocaleKey );
}