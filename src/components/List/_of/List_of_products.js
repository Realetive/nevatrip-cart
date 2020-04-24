import React from 'react';

let count = 0;

export const ListOfProducts = ( { lang, isRightTranslate, products = [], onChange, Item } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${ListOfProducts.name} of ${Item.name} rerender: ${count}`);
  }
  
  if ( !products.length ) return ( <div className="list">Корзина пуста, как сердце бывшей…</div> )
  
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