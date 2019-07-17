import React from 'react';
import StoreContext from 'storeon/react/context';

//import Catcher from "../Catcher/Catcher";
import { Cart } from "../Cart/Cart";
import { store } from "../../state";

import './App.css';

export default function App({session}) {
  return (
    // <Catcher>
      <StoreContext.Provider value={ store }>
        <Cart session={ session } />
      </StoreContext.Provider>
    // </Catcher>
  );
}