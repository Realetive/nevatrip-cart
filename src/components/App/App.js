import React from 'react';
import { useI18n } from "../../i18n";
import { Cart } from "../Cart/Cart";

import { LangProvider } from ".";
import './App.css';

let count = 0;

export default function App( { session, lang } ) {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${App.name} rerender: ${count}`);
  }
  
  const isRightTranslate = useI18n( lang );

  return (
    <LangProvider value={ isRightTranslate }>
      <Cart session={ session } />
    </LangProvider>
  );
}
