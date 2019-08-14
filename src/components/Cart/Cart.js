import React, { useEffect, useState, useRef } from 'react';
import useStoreon from 'storeon/react';

import { Product } from '../Product/Product';
import { ProductPreview } from '../ProductPreview/ProductPreview';

import { api } from "../../api";

import './Cart.css';

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

export const Cart = ({session}) => {
  const { dispatch, cart, user, order, ticket } = useStoreon('cart', 'user', 'order', 'ticket');
  const { fullName, email, phone } = user;
  const [isShowPromocode, setShowPromocode] = useState(false);
  const [sale, setSale] = useState(0);
  const [promocode, setPromocode] = useState('');
  const throttled = useRef(throttle(async (newValue) => {
    if (newValue) {
      const resp = await api.order.promocode(57, newValue);
      setSale(resp);
    }
  }, 700));

  useEffect(() => {
    throttled.current(promocode)
  }, [promocode])

  useEffect(() => {
    dispatch('cart/get', session);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const products = () => cart.map( key => {
    const { productId } = order[key];

    return (
      <li className='cart__item cart__item_view_product' key={ key }>
        <Product
          cartKey={key}
          productId={productId}
        />
      </li>
    );
  } )

  const productsPreview = () => cart.map( key => {
    const { productId } = order[key];

    return (
      <li className='cart__item cart__item_view_product' key={ key }>
        <ProductPreview
          cartKey={key}
          productId={productId}
        />
      </li>
    );
  } )

  const setUserData = (event) => {
    user[event.target.name] = event.target.value;

    dispatch('user/update', user);
  };

  const sum = Object.values(order).reduce( ( sum, cartItem ) => {
    if ( !cartItem.options || !cartItem.options.length ) return 0;

    const {
      productId,
      options: [{
        direction,
        tickets
      }],
    } = cartItem;

    if (!direction || !tickets) return 0;

    Object.keys(tickets).forEach(key => {
      const count = tickets[ key ] || 0;
      const ticketKey = `${productId}.${direction}.${key}`;

      if ( ticket.hasOwnProperty( ticketKey ) ) {
        const { price } = ticket[ ticketKey ];
        sum += count * price;
      }
    } );

    return Math.ceil( sum - ( sum * ( sale / 100 ) ) );
  }, 0 );

  const checkOut = async e => {
    e.preventDefault();

    await api.cart.updateCart(session, Object.values(order), promocode);
    const createOrder = await api.order.newOrder({ sessionId: session, user });

    console.log('createOrder', createOrder);
    
    if (sale < 100 && createOrder.payment.Model.Number) {
      const invoiceId = createOrder.payment.Model.Number;
  
      const pay = function () {
        const cp = window.cp;
        const widget = new cp.CloudPayments();
        widget.charge({
          publicId: 'pk_9571506275254507c34463787fa0b',  //id из личного кабинета
          description: 'Оплата на сайте NevaTrip.ru', //назначение
          amount: sum, //сумма
          currency: 'RUB', //валюта
          invoiceId, //номер заказа  (необязательно)
          accountId: user.email, //идентификатор плательщика (необязательно)
          skin: "mini", //дизайн виджета
          // data: {
          //   myProp: 'myProp value' //произвольный набор параметров
          // }
        },
        function (success) { // success
          console.log('success', success);
  
          window.location.href = '/';
        },
        function (reason, fail) { // fail
          console.log('reason', reason);
          console.log('fail', fail);
  
          alert( 'Оплата не прошла' );
        });
      };
  
      pay();
    } else {
      alert('Заказ по 100% промокоду успешно зарегистрирован')
      window.location.href = '/';
    }

  };
  
  return cart && !cart.loading && !cart.error
    ? <form className='cart' method='post' onSubmit={ checkOut }>
        <ul className='list'>{ products() }</ul>
        <div className='aside'>
          <span className = 'caption caption_l'>Ваш заказ</span>
          <ul className='listPreview'>{ productsPreview() }</ul>
          <div className = 'asideSeparator' ></div>
          <div className='cart__user'>
            {
              [
                { name: 'fullName', type: 'text', value: fullName, label: 'Фамилия и имя' },
                { name: 'email', type: 'email', value: email, label: 'E-mail' },
                { name: 'phone', type: 'phone', value: phone, label: 'Телефон' }
              ].map( field => (
                <div key={ field.name }>
                  <label className='form-label'>
                    <span className='caption'>
                      {field.label}
                    </span>
                    <input
                      className='input'
                      type={ field.type }
                      name={ field.name }
                      defaultValue={ field.value }
                      onBlur={ setUserData }
                      required
                    />
                  </label>
                </div>
              ))
            }
          </div>
          <div className='cart__promocode'>
            {
              isShowPromocode
              ? <label className='form-label'>
                  <span className='caption'>
                    Промокод&nbsp;
                    {
                      sale > 0 ? `«${ promocode.toUpperCase() }» на ${ sale }% 👍` : null
                    }
                  </span>
                  <input
                    className='input'
                    name='promocode'
                    defaultValue={promocode}
                    onKeyUp={ e => setPromocode( e.target.value ) }
                    autoComplete='off'
                    autoFocus={isShowPromocode}
                    onBlur={()=> !promocode && setShowPromocode(false)}
                  />
                </label>
              : <button className="btn-radio__label" onClick={ () => setShowPromocode(true) }>У меня есть промокод</button>
            }
          </div>
          <span className='checkbox'>
            <input className='checkboxInput' type='checkbox' required='required' id='ofertaCheck'/>
            <label className='caption checkboxCaption' htmlFor='ofertaCheck'>
              Согласен с&nbsp;
              <a href="https://nevatrip.ru/oferta" target="_blank" rel="noopener noreferrer">офертой и условиями возврата</a>
            </label>
          </span>
          <button className='btn btn_block btn_primary'>
            Оплатить { sum } ₽
          </button>
        </div>
      </form>
    : 'Загрузка'
};
