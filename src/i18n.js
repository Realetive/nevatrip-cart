import { useState, useEffect } from 'react';
import _i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { registerLocale } from 'react-datepicker';

_i18n
  .use( initReactI18next ) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          'locale': 'en',
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
          'тип билета': 'Ticket type',
          'Выберите время отправления': 'Select departure time',
          'Выберите категории билетов': 'Select ticket type',
          'Выберите дату': 'Select date',
          'date_format': 'm/d/yyyy',
          'currency': '€',
          'widgetLang': 'en-US',
          'currencyTag': 'EUR',
          'Похоже, часовой пояс экскурсии отличается от вашего': 'It seems like the time zone of the tour is different from yours',
          'Указано отправление по местному времени': 'Departure time is indicated according to the local time',
          'Это время уже не доступно': 'This time is no longer available',
          'Используем для персонализации': 'We use it to identify you',
          'На адрес этой почты мы пришлем вам билет на прогулку': 'We use it to send you a ticket',
          'В случае изменений, мы оповестим вас по номеру телефона': 'In case of any changes, we will contact you',
          'Нет выбранных билетов': 'Choose at least one ticket',
          'Билетов на данный момент нет': 'There are no tickets at the moment',
          'На выбранную вами дату нет прогулок': 'There are no tours on chosen date',
          'Выберите направление': 'Select direction',
          'направление': 'direction',
          'Что-то пошло не так...': 'Something went wrong...',
          'Корзина пуста': 'Cart is empty',
          'calendarLocaleKey': 'en-US',
          'Нет расписания на выбранное направление, но оно появится в скором времени': 'Нет расписания на выбранное направление, но оно появится в скором времени',
        }
      },
      ru: {
        translation: {
          'locale': 'ru',
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
          'тип билета': 'тип билета',
          'Выберите время отправления': 'Выберите время отправления',
          'Выберите категории билетов': 'Выберите категории билетов',
          'Выберите дату': 'Выберите дату',
          'date_format': 'dd.mm.yyyy',
          'currency': '€',
          'widgetLang': 'ru-RU',
          'currencyTag': 'EUR',
          'Похоже, часовой пояс экскурсии отличается от вашего': 'Похоже, часовой пояс экскурсии отличается от вашего',
          'Указано отправление по местному времени': 'Указано отправление по местному времени',
          'Это время уже не доступно': 'Это время уже не доступно',
          'Используем для персонализации': 'Используем для персонализации',
          'На адрес этой почты мы пришлем вам билет на прогулку': 'На адрес этой почты мы пришлем вам билет на прогулку',
          'В случае изменений, мы оповестим вас по номеру телефона': 'В случае изменений, мы оповестим вас по номеру телефона',
          'Нет выбранных билетов': 'Нет выбранных билетов',
          'Билетов на данный момент нет': 'Билетов на данный момент нет',
          'На выбранную вами дату нет прогулок': 'На выбранную вами дату нет прогулок',
          'Выберите направление': 'Выберите направление',
          'направление': 'направление',
          'Что-то пошло не так...': 'Something went wrong...',
          'Корзина пуста': 'Cart is empty',
          'calendarLocaleKey': 'ru',
          'Нет расписания на выбранное направление, но оно появится в скором времени': 'Нет расписания на выбранное направление, но оно появится в скором времени',
        }
      },
      de: {
        translation: {
          'locale': 'de',
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
          'тип билета': 'Ticketkategorie',
          'Выберите время отправления': 'Abfahrtszeit wählen',
          'Выберите категории билетов': 'Ticketkategorie wählen',
          'Выберите дату': 'Datum wählen',
          'date_format': 'yyyy-mm-dd',
          'currency': '€',
          'widgetLang': 'en-US',
          'currencyTag': 'EUR',
          'Это время уже не доступно': 'Diese Zeit ist nicht mehr verfügbar',
          'Используем для персонализации': 'Wird zur Identifizierung genutzt',
          'На адрес этой почты мы пришлем вам билет на прогулку': 'An diese Adresse wird dein Ticket geschickt',
          'В случае изменений, мы оповестим вас по номеру телефона': 'Bei Änderungen informieren wir dich sofort',
          'Нет выбранных билетов': 'Wählen Sie mindestens ein Ticket',
          'Билетов на данный момент нет': 'Im Moment sind keine Tickets verfügbar',
          'На выбранную вами дату нет прогулок': 'Für das gewählte Datum sind keine Tickets verfügbar',
          'Выберите направление': 'Select direction',
          'направление': 'direction',
          'Что-то пошло не так...': 'Something went wrong...',
          'Корзина пуста': 'Cart is empty',
          'calendarLocaleKey': 'de',
          'Нет расписания на выбранное направление, но оно появится в скором времени': 'Нет расписания на выбранное направление, но оно появится в скором времени',
        }
      },
      cs: {
        translation: {
          'locale': 'cs',
          'Ваш заказ': 'Vaše objednávka',
          'Фамилия и имя': 'Příjmení a jméno',
          'E-mail': 'E-mail',
          'Телефон': 'Telefon',
          'Промокод': 'Slevový kód',
          'У меня есть промокод': 'Mám Slevový kód',
          'Я согласен': 'Souhlasím s',
          'условиями покупки и политикой': 'podmínkami a zásadami ochrany osobních údajů',
          'oferta': 'https://cs.prahartip.cz/obchodni-podminky',
          'Оплатить': 'Zaplatit',
          'В ночь с': 'V noci od',
          'на': 'do',
          'дата': 'Datum',
          'время': 'Čas',
          'тип билета': 'Kategorie vstupenek',
          'Выберите время отправления': 'Vyberte čas odjezdu',
          'Выберите категории билетов': 'Vyberte kategorie vstupenek',
          'Выберите дату': 'Vyberte datum',
          'date_format': 'd. m. yyyy',
          'currency': '€',
          'widgetLang': 'cs-CZ',
          'currencyTag': 'EUR',
          'Похоже, часовой пояс экскурсии отличается от вашего': 'Vypadá to, že časové pásmo, ve kterém je plavba, je rozdílné od vašeho',
          'Указано отправление по местному времени': 'Čas odjezdu je dle místního času',
          'Это время уже не доступно': 'Tento čas již není k dispozici',
          'Используем для персонализации': 'Tyto data využijeme k Vaší identifikaci',
          'На адрес этой почты мы пришлем вам билет на прогулку': 'Vaše adresa bude využitá k zaslání palubních lístků',
          'В случае изменений, мы оповестим вас по номеру телефона': 'V případě změn Vás budeme kontaktovat',
          'Нет выбранных билетов': 'Vyberte alespoň jednu vstupenku',
          'Билетов на данный момент нет': 'Momentálně nejsou k dispozici žádné vstupenky',
          'На выбранную вами дату нет прогулок': 'V daném termínu není k dispozici žádná plavba',
          'Выберите направление': 'Select direction',
          'направление': 'direction',
          'Что-то пошло не так...': 'Something went wrong...',
          'Корзина пуста': 'Cart is empty',
          'calendarLocaleKey': 'cs',
          'Нет расписания на выбранное направление, но оно появится в скором времени': 'Нет расписания на выбранное направление, но оно появится в скором времени',
        }
      },
    },
    fallbackLng: process.env.REACT_APP_DEFAULT_LANG,
    interpolation: {
      escapeValue: false
    }
  });

/* Мы подписывваемся на изменения значения атрибута lang тега html. И при переводе страницы с поомщью плагина Google Translate в Chrome
новое значение атрибута lang будет обработано i18n и произойдет перерендер всей формы покупки. */
const html = document.documentElement;
const observer = new MutationObserver( function(mutationsList) {
  for (const mutation of mutationsList) {
    const attr = mutation.attributeName;
    const lang = mutation.target.getAttribute(attr);
    
    _i18n.changeLanguage( lang );
  }
});

observer.observe(html, { attributeFilter: ['lang'] });

export const useI18n = lang => {
  const [ isRightTranslate, setIsRightTranslate ] = useState( true );
  
  useEffect( () => {
    const onChangeLang = ( lang, _i18n ) => {
      /* Календарь будет создан в фомате en, если язык перевода страницы с помощью плагина-переводчика не совпадает ни с одним языком в нашем объекте, зарегистрированном в i18n. */
      let calendarLocale = require( `date-fns/locale/${ _i18n.t( 'calendarLocaleKey' ) }` );
      registerLocale('calendarLocale', calendarLocale.default );
      
      /* Если при переводе страницы новый язык совпадает с языком, для котого уже предусмотрен перевод в i18n, то для страницы будет запрещен
      перевод с помощью плагина браузера и перевод будет взят из ресурсов i18n. В противном случае isRightTranslate будет равен true и перевод будет разрешен для отдельных сущностей.  */
      const isRightTranslate = Object.keys( _i18n.services.resourceStore.data ).includes( lang );
    
      return isRightTranslate;
    }
    
    _i18n.changeLanguage( lang );
    
    onChangeLang( lang, _i18n );
    
    _i18n.on( 'languageChanged', newLang => setIsRightTranslate( onChangeLang( newLang, _i18n ) ) );
  }, [ lang ] )

  return isRightTranslate;
}
export default _i18n;