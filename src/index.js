import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import i18n from "./i18n";

const root = document.getElementById('root');
const lang = root.getAttribute('lang');
const session = new URL( window.location.href ).searchParams.get( 'session' )
                || root.dataset.session
                || 'test-test-test';

const html = document.querySelector('html');
const [ currentLang, isRightTranslate ] = i18n(lang);

const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
        const attr = mutation.attributeName;
        const lang = mutation.target.getAttribute(attr);
        const [ currentLang, isRightTranslate ] = i18n(lang);

        render(
            <App session={session} lang={currentLang} isRightTranslate={isRightTranslate} />,
            root
        );
    }
});

observer.observe(html, { attributeFilter: ['lang'] });

render(
  <App session={ session } lang={ lang } />,
  root
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
