// Core
import React from 'react';
import useStoreon from 'storeon/react';

// Components
import { Calendar } from '../Calendar/Calendar';
import { Directions } from '../Directions/Directions';
import { Time } from '../Time/Time';
import { Tickets } from '../Tickets/Tickets';

import './Product.css';

export const Product = (props) => {
  const { cartKey, productId } = props;
  const { product, order } = useStoreon( 'product', 'order' );
  const title = product[ productId ].title.ru.name;
  const [ { direction, date } ] = order[ cartKey ].options || [ {} ];
  
  const urlToProduct = product[ productId ].oldId ? `//nevatrip.ru/index.php?id=${ product[ productId ].oldId }` : '';

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
          { date && <Time {...props} /> }
          { direction && <Tickets {...props} /> }
        </div>
      </div>
    </fieldset>
  );
};
