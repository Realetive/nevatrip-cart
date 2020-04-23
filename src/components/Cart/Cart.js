import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetOrder } from "../../api";

import { ListOfProducts } from "../List/_of/List_of_products";
import { ProductViewSelect, ProductViewPreview } from "../Product/_view";
import { Promocode } from "../Promocode/Promocode";

import 'react-datepicker/dist/react-datepicker.css';
import './Cart.css';
import '../Calendar/Calendar.css';

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
// function throttle( func, wait, options ) {
//   let context, args, result;
//   let timeout = null;
//   let previous = 0;
//
//   if ( !options ) options = {};
//
//   const later = () => {
//     previous = options.leading === false ? 0 : Date.now();
//     timeout = null;
//     result = func.apply(context, args);
//     if (!timeout) context = args = null;
//   };
//
//   return function() {
//     const now = Date.now();
//
//     if ( !previous && options.leading === false ) previous = now;
//
//     const remaining = wait - (now - previous);
//     context = this;
//     args = arguments;
//
//     if ( remaining <= 0 || remaining > wait ) {
//       if (timeout) {
//         clearTimeout( timeout );
//         timeout = null;
//       }
//
//       previous = now;
//       result = func.apply(context, args);
//
//       if (!timeout) context = args = null;
//     } else if ( !timeout && options.trailing !== false ) {
//       timeout = setTimeout(later, remaining);
//     }
//
//     return result;
//   };
// }

let count = 0;

export const Cart = ( { session, lang, isRightTranslate } ) => {
  count += 1;
  console.log( `${ Cart.name } rerender: ${ count }` );
  const { t } = useTranslation();
  const [ cart, setCart ] = useGetOrder( session );
  const [ sum ] = useState( 0 );

  const updateOrder = ( index, options ) => {
    if ( cart.status === 'loaded' ) {
      const newProducts = [ ...cart.payload.products ];
      newProducts[ index ].options = options;
      
      setCart( {
        status: 'loaded',
        payload: {
          ...cart.payload,
          products: newProducts,
        }
      } );
    }
  }

  const {
    fullName = '',
    phone = '',
    email = '',
  } = cart.user || {};
  
  return (
    <form className='form' method='post' onSubmit={ e => { console.log( `onSubmit`, e ); } }>
      { cart.status === 'loading' && 'Loading…' }
      { cart.status === 'loaded' && <ListOfProducts lang={ lang } isRightTranslate={ isRightTranslate } products={ cart.payload.products } onChange={ updateOrder } Item={ ProductViewSelect } /> }
      { cart.status === 'error' && 'Что-то пошло не так…' } { /* TODO: Добавить вёрстку */ }
      <div className='aside'>
        <div className="aside__blank">
          <span className={ 'caption caption_l' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Ваш заказ' ) }</span>
          { cart.status === 'loading' && 'Loading…' }
          { cart.status === 'loaded' && <ListOfProducts lang={ lang } isRightTranslate={ isRightTranslate } products={ cart.payload.products } Item={ ProductViewPreview } /> }
          { cart.status === 'error' && 'Что-то пошло не так…' } { /* TODO: Добавить вёрстку */ }
        </div>

        <div className = 'asideSeparator'><div className="asideSeparator__line"></div></div>

        <div className="aside__blank">
          <div className='cart__user'>
            {
              [
                {
                  name: 'fullName',
                  type: 'text',
                  value: fullName,
                  label: t( 'Фамилия и имя' ),
                  maxlength: '250'
                },
                {
                  name: 'email',
                  type: 'email',
                  value: email,
                  label: t( 'E-mail' ),
                  pattern: '^[-._a-zA-Za-яA-я0-9]{2,}@(?:[a-zA-Za-яА-Я0-9][-a-z-A-Z-a-я-А-Я0-9]+\\.)+[a-za-я]{2,6}$',
                  maxlength: '250'
                },
                {
                  name: 'phone',
                  type: 'phone',
                  value: phone,
                  label: t( 'Телефон' ),
                  pattern: '(\\+?\\d[- .()]*){10,22}',
                  maxlength: '22',
                  placeholder: '+7 9__ ___-__-__'
                }
              ].map( field => (
                <div key={field.name} className='cart__field'>
                      <label className='form-label' htmlFor={`id-${field.name}`}>
                        <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>
                          { field.label }
                        </span>
                      </label>
                      <div className='form-input-wrap'>
                        <input
                            className='input'
                            id={`id-${field.name}`}
                            type={field.type}
                            name={field.name}
                            defaultValue={field.value}
                            // onBlur={setUserData}
                            maxLength={field.maxlength}
                            pattern={field.pattern}
                            placeholder={field.placeholder}
                            required
                        />
                        <svg className='form-icon' fill='green' viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>
                      </div>
                      <div className={ 'cart__tooltip' + ( isRightTranslate ? '' : ' translate' ) }>
                          { (field.name === 'fullName' && t('Почему используем имя'))
                            || (field.name === 'email' && t('Почему используем e-mail'))
                            || (field.name === 'phone' && t('Почему используем телефон'))
                            || ''
                          }
                      </div>
                    </div>
              ) )
            }
          </div>
          <Promocode
            className='cart__promocode'
            isRightTranslate={isRightTranslate}
            promocode=''
            sale={0}
            onChange={ promocode => { console.log( `promocode`, promocode ); } }
          />
          <span className='checkbox'>
            <input className='checkboxInput' type='checkbox' required='required' id='ofertaCheck'/>
            <label className={ 'caption checkboxCaption' + (isRightTranslate ? '' : ' translate' ) } htmlFor='ofertaCheck'>
              { t( 'Я согласен' ) }&nbsp;
              <a href={ t( 'oferta' ) } target="_blank" rel="noopener noreferrer">{ t( 'условиями покупки и политикой' ) }</a>
            </label>
          </span>
          <button className='btn btn_block btn_primary submitBtn' disabled={ true }>
            <span className={ isRightTranslate ? '' : ' translate' }>{ t( 'Оплатить' ) }</span> { sum } { t( 'currency' ) }
          </button>
          <div className='cart__error' >
            <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ t('Нет выбранных билетов') }</span>
          </div>
        </div>
      </div>
    </form>
  )
};
