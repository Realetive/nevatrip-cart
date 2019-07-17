import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';

import { Product } from '../Product/Product';
import { ProductPreview } from '../ProductPreview/ProductPreview';

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
    if (!cartItem.options ) return 0;
    
    const {
      productId,
      options: {
        direction,
        tickets
      },
    } = cartItem;
    
    if (!direction || !tickets) return 0;
    
    
    Object.keys( tickets ).forEach( key => {
      const count = tickets[ key ] || 0;
      const ticketKey = `${productId}.${direction}.${key}`;
      const { price } = ticket[ ticketKey ];
      sum += count * price;
    } );
    
    return sum;
  }, 0 );
  
  const checkOut = e => {
    e.preventDefault();
 
    const order = {
      session,
      user,
    };
    
    const pay = function () {
      var cp = window.cp;
        var widget = new cp.CloudPayments();
        widget.charge({ // options
          publicId: 'pk_9571506275254507c34463787fa0b',  //id из личного кабинета
          description: 'Пример оплаты (деньги сниматься не будут)', //назначение
          amount: sum, //сумма
          currency: 'RUB', //валюта
          invoiceId: '1234567', //номер заказа  (необязательно)
          accountId: user.email, //идентификатор плательщика (необязательно)
          skin: "mini", //дизайн виджета
          data: {
            myProp: 'myProp value' //произвольный набор параметров
          }
        },
        function (options) { // success
          console.log('options', options);
          
          alert( 'Оплата прошла успешно' );
        },
        function (reason, options) { // fail
          console.log('reason', reason);
          console.log('options', options);
          
          alert( 'Оплата не прошла' );
        });
    };
    
    pay();    
    
    console.log('order', order);
  };
    
  return cart && !cart.loading && !cart.error
    ? <form className='cart' method='post' onSubmit={ checkOut }>
        <ul className='cart__list'>{ products() }</ul>
        <div className='cart__aside'>
          <ul className='cart__preview'>{ productsPreview() }</ul>
          <div className='cart__user'>
            {
              [
                { name: 'fullName', type: 'text', value: fullName, label: 'Ф. И. О.' },
                { name: 'email', type: 'email', value: email, label: 'Email' },
                { name: 'phone', type: 'phone', value: phone, label: 'Телефон' }
              ].map( field => (
                <div key={ field.name }>
                  <label className='field'>
                    <span className='field__label'>
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
          <button className='button button_view_action'>
            Оплатить { sum } ₽
          </button>
        </div>
      </form>
    : 'Загрузка'
};
