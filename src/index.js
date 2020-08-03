import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

const root = document.getElementById('root');
const query = new URL( window.location.href ).searchParams;
const lang = query.get( 'cart-lang' ) || root.getAttribute('lang') || 'en';
const session = query.get( 'cart-session' ) || root.dataset.session || 'test-test-test';

render(
  <App session={ session } lang={ lang } />,
  root
);
    
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
