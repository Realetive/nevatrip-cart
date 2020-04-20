import React from 'react';
import { ProductViewSelect } from "../../Product/_view/Product_view_select";

export const ListOfProducts = ( { lang, isRightTranslate, products } ) => {
  return (
    <ul className="list">
      {
        products.map( ( { product, options = {} }, index ) => {
          const onChange = _options => {
            options = _options;
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