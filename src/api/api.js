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

    async updateCart (session, products) {
      return await fetch(
        `${MAIN_URL}/shoppingCarts/${session}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            session,
            products,
          }),
        }
      );
    },
  },
  product: {
    async getProductData (productId) {
      const response = await fetch(
        `${MAIN_URL}/product/${productId}/cart`,
        {
          method: 'GET',
          headers,
        }
      );

      return response.json();
    },

    async productDates (productId) {
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
  },
};
