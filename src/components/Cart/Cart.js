import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { api, useGetOrder } from "../../api";

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
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${Cart.name} rerender: ${count}`);
  }
  const { t } = useTranslation();
  const [ cart, setCart ] = useGetOrder( session );
  const initUser = { fullName: '', phone: '', email: '' };
  const [ user, setUser ] = useState( cart.status === 'loaded' ? cart.payload.user || initUser : initUser );
  const [ ticketsCount, setTicketsCount ] = useState( 0 );
  const [ sum, setSum ] = useState( 0 );
  const [ promocode, setPromocode ] = useState('');
  const [ sale ] = useState(0); // скидка в %
  const states = {
    DEFAULT: 'default',
    PAYING: 'paying',
    PAID: 'paid',
  }
  const [ state, setState ] = useState( states.DEFAULT );

  /* При изменении cart меняем общее количество билетов и общую сумму. */
  useEffect( () => {
    if ( cart.status === 'loaded' ) {
      const count = ( cart.payload.products || [] ).reduce( ( acc, { product, options } ) => {
        const direction = product.directions.find( direction => direction._key === options.direction );
        
        direction.tickets.forEach( ( { _key, price } ) => {
          const count = options.tickets[ _key ] || 0;
          acc.tickets += count;
          acc.sum += count * price;
        });

        return acc;
      }, { sum: 0, tickets: 0 } );

      setTicketsCount( count.tickets );
      setSum( count.sum );
    }
  }, [ cart ] )

  /* Функция меняет данные в поле payload в объекте cart. */
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

  /* Отправка формы. */
  const onSubmit = async event => {
    event.preventDefault();

    setState( states.PAYING );

    const order = cart.payload.products.map( ( { productId, options } ) => ( {
      productId,
      options: [{...options, direction: { _key: options.direction }}],
    } ) );
    
    debugger;

    await api.cart.updateCart(session, order, promocode, lang);

    const createOrder = await api.order.newOrder({ sessionId: session, user });

    if (sum !== 0 && sale < 100) {
      if ( !((( createOrder || {}).payment || {}).Model || {}).Number ) alert('Что-то пошло не так…')

      const invoiceId = createOrder.payment.Model.Number;

      const pay = function() {
        const cp = window.cp;
        const widget = new cp.CloudPayments({
          language: t( 'widgetLang' ),
          googlePaySupport: false,
        });
        const {
          REACT_APP_CLOUDPAYMENTS_PUBLICID: publicId,
          REACT_APP_PROJECT_NAME: projectName,
        } = process.env;
        widget.charge({
          publicId,                                      // id из личного кабинета
          description: `River cruise ${ projectName }`,  // назначение
          amount: sum,                                   // сумма
          currency: t( 'currencyTag' ),                  // валюта
          invoiceId,                                     // номер заказа (необязательно)
          accountId: user.email,                         // идентификатор плательщика (необязательно)
          skin: "mini",                                  // дизайн виджета
        },
        function (success) { // success
          console.log('success', success);

          setState( states.PAID )
        },
        function (reason, fail) { // fail
          console.log('reason', reason);
          console.log('fail', fail);

          alert( 'Оплата не прошла' );
        });
      };

      pay();
    } else { // 100% промокод
      setState( states.PAID )
    }
  }

  return (
    <form className='form' method='post' disabled={ state !== states.DEFAULT } onSubmit={ onSubmit }>
      {
        state === states.PAID && (
          <div className='form__success'>
            <span role="img" aria-label="Congratulation!">🎉</span>
            <br />{ t( 'Спасибо за покупку' ) }
          </div>
        )
      }
      { cart.status === 'loading' && 'Loading…' }
      { cart.status === 'loaded' && <ListOfProducts lang={ lang } isRightTranslate={ isRightTranslate } products={ cart.payload.products } onChange={ updateOrder } Item={ ProductViewSelect } /> }
      { cart.status === 'error' && <div className={'' + ( isRightTranslate ? '' : ' translate' )}>{ t( 'Что-то пошло не так…' ) }</div> }
      <div className='aside'>
        <div className="aside__blank">
          <span className={ 'caption caption_l' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Ваш заказ' ) }</span>
          { cart.status === 'loading' && 'Loading…' }
          { cart.status === 'loaded' && <ListOfProducts lang={ lang } isRightTranslate={ isRightTranslate } products={ cart.payload.products } Item={ ProductViewPreview } /> }
          { cart.status === 'error' && <div className={'' + ( isRightTranslate ? '' : ' translate' )}>{ t( 'Что-то пошло не так…' ) }</div> }
        </div>

        <div className = 'asideSeparator'><div className="asideSeparator__line"></div></div>

        <div className="aside__blank">
          <div className='cart__user'>
            {
              [
                {
                  name: 'fullName',
                  type: 'text',
                  value: user.fullName,
                  label: t( 'Фамилия и имя' ),
                  maxlength: '250'
                },
                {
                  name: 'email',
                  type: 'email',
                  value: user.email,
                  label: t( 'E-mail' ),
                  pattern: '^[-._a-zA-Za-яA-я0-9]{2,}@(?:[a-zA-Za-яА-Я0-9][-a-z-A-Z-a-я-А-Я0-9]+\\.)+[a-za-я]{2,6}$',
                  maxlength: '250'
                },
                {
                  name: 'phone',
                  type: 'phone',
                  value: user.phone,
                  label: t( 'Телефон' ),
                  pattern: '(\\+?\\d[- .()]*){10,22}',
                  maxlength: '22',
                  placeholder: ''
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
                            onBlur={ e => setUser( { ...user, [ field.name ]: e.target.value } ) }
                            maxLength={field.maxlength}
                            pattern={field.pattern}
                            placeholder={field.placeholder}
                            required
                        />
                        <svg className='form-icon' fill='green' viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>
                      </div>
                      <div className={ 'cart__tooltip' + ( isRightTranslate ? '' : ' translate' ) }>
                          { (field.name === 'fullName' && t('Используем для персонализации'))
                            || (field.name === 'email' && t('На адрес этой почты мы пришлем вам билет на прогулку'))
                            || (field.name === 'phone' && t('В случае изменений, мы оповестим вас по номеру телефона'))
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
            promocode={ promocode }
            sale={0}
            onChange={ promocode => setPromocode( promocode ) }
          />
          <span className='checkbox'>
            <input className='checkboxInput' type='checkbox' required='required' id='ofertaCheck'/>
            <label className={ 'caption checkboxCaption' + (isRightTranslate ? '' : ' translate' ) } htmlFor='ofertaCheck'>
              { t( 'Я согласен' ) }&nbsp;
              <a href={ t( 'oferta' ) } target="_blank" rel="noopener noreferrer">{ t( 'условиями покупки и политикой' ) }</a>
            </label>
          </span>
          <button className='btn btn_block btn_primary submitBtn' disabled={ !ticketsCount }>
            <span className={ isRightTranslate ? '' : ' translate' }>{ t( 'Оплатить' ) }</span> { sum } { t( 'currency' ) }
          </button>
          {
            !ticketsCount && (
              <div className='cart__error' >
                <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ t('Нет выбранных билетов') }</span>
              </div>
            )
          }
        </div>
      </div>
    </form>
  )
};
