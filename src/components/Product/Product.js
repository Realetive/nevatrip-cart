import React from 'react';
import useStoreon from 'storeon/react';

import { Calendar } from '../Calendar/Calendar';
import { Directions } from '../Directions/Directions';
import { Time } from '../Time/Time';
import { Tickets } from '../Tickets/Tickets';

import './Product.css';
import {useTranslation} from 'react-i18next';

export const Product = (props) => {
  const { t } = useTranslation();
  const { cartKey, productId, isTicketTime } = props;
  const { product, order } = useStoreon( 'product', 'order' );
  const title = product[productId].title;
  let direction, date;
  if (order[cartKey].options && order[cartKey].options.length) {
    direction = order[cartKey].options[0].direction;
    date = order[cartKey].options[0].date;
  }

  const urlToProduct = product[productId].oldId ? `//nevatrip.ru/index.php?id=${ product[productId].oldId }` : '';

  return (
    <fieldset className='product product_view_form'>
      <legend className='product__legend'>
        {
          urlToProduct
            ? <a href={urlToProduct} style={{ color: 'inherit', textDecoration: 'none' }}>
                {title}
              </a>
            : title
        }
      </legend>
      <div className='product__inner'>
        <div className='colDesktop'>
          { direction && <Calendar {...props} /> }
        </div>
        <div className='colDesktop'>
          <Directions {...props} />
          {
            ( date && <Time {...props} /> ) ||
            ( isTicketTime && <div className='cart__error'>{ t('На выбранную дату нет билетов') }</div> )
          }
          { direction && <Tickets {...props} /> }
        </div>
      </div>
    </fieldset>
  );
};
