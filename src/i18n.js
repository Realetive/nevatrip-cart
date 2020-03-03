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
              'условиями покупки и политикой': 'the Terms and Conditions and Privacy Policy',
              'oferta': 'https://prahartip.cz/terms-of-use',
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
              'currency': '€',
              'currencyTag': 'EUR',
              'Похоже, часовой пояс экскурсии отличается от вашего': 'It seems like the time zone of the tour is different from yours',
              'Указано отправление по местному времени': 'Departure time is indicated according to the local time',
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
              'условиями покупки и политикой': 'условиями покупки и политикой конфиденциальности',
              'oferta': 'https://ru.prahartip.cz/oferta',
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
              'currency': '₽',
              'currencyTag': 'RUB',
              'Похоже, часовой пояс экскурсии отличается от вашего': 'Похоже, часовой пояс экскурсии отличается от вашего',
              'Указано отправление по местному времени': 'Указано отправление по местному времени',
            }
          },
          de: {
            translation: {
              'Ваш заказ': 'Ihre Bestellung',
              'Фамилия и имя': 'Vorname und Nachname',
              'E-mail': 'E-mail',
              'Телефон': 'Mobilnummer',
              'Промокод': 'Rabattcode',
              'У меня есть промокод': 'Ich habe einen Rabattcode',
              'Я согласен': 'Ich stimme ',
              'условиями покупки и политикой': 'den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zu',
              'oferta': 'https://de.prahartip.cz/nutzungsbedingungen',
              'Оплатить': 'Weiter zur Zahlung',
              'В ночь с': 'in der Nacht vom ',
              'на': 'auf den',
              'дата': 'Datum',
              'время': 'Zeit',
              'билеты': 'Ticketkategorie',
              'Выберите время отправления': 'Abfahrtszeit wählen',
              'Выберите категории билетов': 'Ticketkategorie wählen',
              'Дата поездки': 'Datum wählen',
              'date_format': 'yyyy-mm-dd',
              'currency': '₽',
              'currencyTag': 'RUB',
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
              'условиями покупки и политикой': 'podmínkami a zásadami ochrany osobních údajů',
              'oferta': 'https://cs.prahartip.cz/obchodni-podminky',
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
              'currency': '₽',
              'currencyTag': 'RUB',
              'Похоже, часовой пояс экскурсии отличается от вашего': 'Vypadá to, že časové pásmo, ve kterém je plavba, je rozdílné od vašeho',
              'Указано отправление по местному времени': 'Čas odjezdu je dle místního času',
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
