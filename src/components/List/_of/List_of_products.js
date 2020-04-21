import React from 'react';
import { ProductViewSelect } from "../../Product/_view/Product_view_select";

export const ListOfProducts = ( { lang, isRightTranslate, products, updateOrder } ) => {
  return (
    <ul className="list">
      {
        products.map( ( { product, options = {}, key }, index ) => {
          
          const onChange = _options => {
            updateOrder( index, _options );
          }
          
          return (
            <li className="cart__item cart__item_view_product" key={ index }>
              <ProductViewSelect
                lang={ lang }
                isRightTranslate={ isRightTranslate }
                product={ product }
                options={ options }
                onChange={ onChange }
              />
            </li>
          )
        } ) 
      }
    </ul>
  )
}