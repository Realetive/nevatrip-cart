import { normalize, schema } from 'normalizr';

import { api } from '../api';

export default (store) => {
  store.on('@init', () => ({ cart: null }));
  
  store.on('cart/loading', (state, loading) => {
    let cart = { ...state['cart'], loading }
    return { ...state, cart }
  });

  store.on('cart/get', async (state, session) => {
    try {
      store.dispatch('cart/loading', true);
      
      const { products: cart } = await api.cart.newCart(session);
      const products = await Promise.all(
        [...new Set(cart.map(item => item.productId))].map((item) => {
          return api.product.getProductData(item);
        })
      );

      // const orderEntity = new schema.Entity('order', {}, { idAttribute: 'event' });
      const cartEntity = new schema.Entity('cart', {}, { idAttribute: 'key' });

      const ticketCategoryEntity = new schema.Entity('ticketCategory', {}, { idAttribute: '_id' });
      const ticketEntity = new schema.Entity(
        'ticket',
        { category: ticketCategoryEntity },
        {
          idAttribute: (value, parent) => `${parent.key}.${value._key}`,
          processStrategy: (value, parent) => ({ ...value, key: `${parent.key}.${value._key}` }),
        }
      );
      const directionEntity = new schema.Entity(
        'direction',
        { tickets: [ticketEntity] },
        {
          idAttribute: (value, parent) => `${parent._id}.${value._key}`,
          processStrategy: (value, parent) => ({ ...value, key: `${parent._id}.${value._key}` }),
        });
      const productEntity = new schema.Entity('product', { directions: [directionEntity],  }, { idAttribute: '_id' });
            
      const data = normalize( { cart, products }, {
        cart: [cartEntity],
        products: [productEntity]
      });

      store.dispatch('order/add', data.entities.cart);
      store.dispatch('direction/add', data.entities.direction);
      store.dispatch('product/add', data.entities.product);
      store.dispatch('ticket/add', data.entities.ticket);
      store.dispatch('ticketCategory/add', data.entities.ticketCategory);
      store.dispatch('cart/add', data.result.cart);
    } catch (error) {
      store.dispatch('cart/error', { cart: null, error, loading: false })
    }
  });
  
  store.on('cart/error', (state, cart) => ({ cart }));

  store.on('cart/add', (state, cart) => ({ cart }));
};
