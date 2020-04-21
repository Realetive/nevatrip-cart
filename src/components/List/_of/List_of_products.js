import React from 'react';
import { ProductViewSelect } from "../../Product/_view/Product_view_select";

export const ListOfProducts = ( { lang, isRightTranslate, products, onChange } ) => {
  return (
    <ul className="list">
      {
        products.map( ( { product, options = {}, key }, index ) => { // TODO: обновить бэкенд — key должен быть уникальным
          const onOptionsChange = _options => {
            onChange( index, _options );
          }
          
          return (
            <li className="cart__item cart__item_view_product" key={ index }>
              <ProductViewSelect
                lang={ lang }
                isRightTranslate={ isRightTranslate }
                product={ product }
                options={ options }
                onChange={ onOptionsChange }
              />
            </li>
          )
        } ) 
      }
    </ul>
  )
}