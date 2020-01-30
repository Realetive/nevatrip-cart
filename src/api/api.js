// Instruments
import { MAIN_URL } from './config';

const headers = { 'Content-Type': 'application/json' };

export const api = {
  cart: {
    async newCart (session) {
      const response = await fetch(
        `${MAIN_URL}/shoppingCarts/${session}`,
        {
          method:  'GET',
          headers,
        }
      );

      return response.json();
    },

    async deleteItem(session, key) {
      return await fetch(
        `${MAIN_URL}/shoppingCarts/${session}/products/${key}`,
        {
          method: 'DELETE',
          headers,
        }
      );
    },

    async updateCart (session, products, promocode) {
      return await fetch(
        `${MAIN_URL}/shoppingCarts/${session}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            sessionId: session,
            products,
            promocode
          }),
        }
      );
    },
  },
  product: {
    async getProductData(productId, lang = 'ru') {
      const response = await fetch(
        `${MAIN_URL}/product/${productId}/cart?lang=${ lang }`,
        {
          method: 'GET',
          headers,
        }
      );

      return response.json();
    },

    async productDates(productId) {
      const response = await fetch(
        `${MAIN_URL}/product/${productId}/dates`,
        {
          method: 'GET',
          headers,
        }
      );

      return response.json();
    },

    async getProductTime(productId, directionId, date) {
      const response = await fetch(
        `${MAIN_URL}/product/${productId}/schedule/${directionId}/${date}`,
        {
          method: 'GET',
          headers,
        }
      );
      
      return response.json()
    },
  },
  order: {
    async newOrder (cart) {
      const response = await fetch(
        `${MAIN_URL}/orders/`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(cart),
        }
      );

      return response.json();
    },

    async promocode(productId, code) {
      if (productId && code) {
        const url = new URL('https://nevatrip.ru/api/promo');
        url.searchParams.append('id', productId);
        url.searchParams.append('code', code);
        const response = await fetch(url);
  
        return response.text();
      }
      
      return 0;
    },

    async getMail (orderId, hash) {
      const response = await fetch( `${MAIN_URL}/orders/${ orderId }/preview?hash=${ hash }` );

      return response.text();
    },

  },
};
