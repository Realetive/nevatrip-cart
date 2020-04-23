import React from 'react';

import { Cart } from "../Cart/Cart";

import './App.css';

let count = 0;

export default function App( { session, lang, isRightTranslate } ) {
  count += 1;
  console.log( `${ App.name } rerender: ${ count }` );
  return (
    <Cart session={ session } lang={ lang } isRightTranslate={ isRightTranslate } />
  );
}
