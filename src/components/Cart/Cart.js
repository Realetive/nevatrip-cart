import React, { useEffect } from 'react';
import useStoreon from 'storeon/react';

import { Product } from '../Product/Product';
import { ProductPreview } from '../ProductPreview/ProductPreview';

import { api } from "../../api";

import './Cart.css';

export const Cart = ({session}) => {
  const { dispatch, cart, user, order, ticket } = useStoreon('cart', 'user', 'order', 'ticket');
  const { fullName, email, phone } = user;

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

    return sum;
  }, 0 );

  const checkOut = async e => {
    e.preventDefault();

    await api.cart.updateCart(session, Object.values(order));
    const createOrder = await api.order.newOrder({ sessionId: session, user });

    console.log('createOrder', createOrder);

    const invoiceId = createOrder.payment.Model.Number;

    const pay = function () {
      const cp = window.cp;
      const widget = new cp.CloudPayments();
      widget.charge({ // options
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
      function (options) { // success
        console.log('options', options);

        alert('Оплата прошла успешно');
        window.location.href = '/';
      },
      function (reason, options) { // fail
        console.log('reason', reason);
        console.log('options', options);

        alert( 'Оплата не прошла' );
      });
    };

    pay();
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
                { name: 'fullName', type: 'text', value: fullName, label: 'Фамилия Имя' },
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
          <span className='checkbox'>
            <input className='checkboxInput' type='checkbox' required='required' id='ofertaCheck'/>
            <label className='caption checkboxCaption' htmlFor='ofertaCheck'>Согласен с условиями возврата</label>
          </span>
          <button className='btn btn_block btn_primary'>
            Оплатить { sum } ₽
          </button>
        </div>
      </form>
    : 'Загрузка'
};
