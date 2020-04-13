import React from 'react';
import StoreContext from 'storeon/react/context';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Calendar } from '../components/Calendar/Calendar';
import { Cart } from '../components/Cart/Cart';
import { store } from '../state';
import i18n from '../i18n';

const root = document.getElementById('root');
const lang = root.getAttribute('lang');
const session = new URL(window.location.href).searchParams.get('session')
    || root.dataset.session
    || 'test-test-test';

const [ currentLang, isRightTranslate ] = i18n(lang);

console.log(currentLang)

// export default {
//     component: Cart,
//     title: "Cart",
//     parameters: {
//                 productId: 'e2334ad5-5b4c-4154-9575-09f800a5bd9c',
//                 isRightTranslate: 'true',
//                 lang: 'en' }
// }

// export const myCart = () => {
//     return (
//         <StoreContext.Provider value={ store }>
//         <Cart session={session} lang={currentLang} isRightTranslate={isRightTranslate} />
//         </StoreContext.Provider>
//     )
// }
//
// myCart.story = {
//     name: 'Loading',
// };



const array= [new Date('Mon Apr 15 2020 00:00:00 GMT+0300 (Москва, стандартное время')];
const generateDate = () => {
    const dates = [];

    for ( let i = 0; i < 5; i++ ) {
        dates.push( new Date() );
    }

    return dates;
};

console.log(generateDate());
const fn = () => {
    console.log('');
}

storiesOf('Calendar', module)
    .add('wi', () => (
        <Calendar isRightTranslate={true}
                  lang='ru'
                  dates={array}
                  onDateChange={fn}
                  selectedDate='2020-04-13T00:00:00.000Z'/>
    ));

