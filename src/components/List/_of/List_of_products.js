import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import LangContext from '../../App';

let count = 0;

export const ListOfProducts = ( { products = [], onChange, Item } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${ListOfProducts.name} of ${Item.name} rerender: ${count}`);
  }

  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );

  if ( !products.length ) return ( <div className={'list' + ( isRightTranslate ? '' : ' translate' )}>{ t( 'Корзина пуста' ) }</div> )
  
  return (
    <ul className="list">
      {
        products.map( ( { product, options = {}, key }, index ) => { // TODO: обновить бэкенд — key должен быть уникальным
          const onOptionsChange = _options => {
            onChange( index, _options );
          }
          
          return (
            <li className="cart__item cart__item_view_product" key={ index }>
              <Item
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