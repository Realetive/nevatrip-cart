import { useState, useEffect } from 'react';
import { MAIN_URL } from './config';

const headers = { 'Content-Type': 'application/json' };

export const useGetOrder = ( session, lang = 'en' ) => {
  const [result, setResult] = useState({
    status: 'loading'
  });

  useEffect(() => {
    if (session) {
      setResult({ status: 'loading' });
      fetch(`${MAIN_URL}/shoppingCarts/${session}`)
        .then( response => response.json() )
        .then( cart => {
          if ( !cart.products ) setResult({ status: 'loaded', payload: cart });

          const ids = cart.products.map( ( { productId } ) => productId );
          const uniqueIds = [ ...new Set( ids ) ];
          
          const getProducts = uniqueIds.map( id => fetch(`${MAIN_URL}/product/${ id }/cart?lang=${ lang }`).then( resp => resp.json() ) )
          
          Promise.allSettled( getProducts ).then( products => {
            const _products = {};

            products.forEach( (product) => {
              if ( product.status === "fulfilled" ) {
                _products[ product.value._id ] = product.value
              }
            });

            cart.products.forEach( product => {
              product.product = _products[ product.productId ]
            } );

            setResult({ status: 'loaded', payload: cart })
          } )
        })
        .catch(error => setResult({ status: 'error', error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return result;
};

export const useGetProduct = (id, lang = process.env.REACT_APP_DEFAULT_LANG) => {
  const [result, setResult] = useState({
    status: 'loading'
  });

  useEffect(() => {
    if (id) {
      setResult({ status: 'loading' });
      fetch(`${MAIN_URL}/product/${ id }/cart?lang=${ lang }`)
        .then(response => response.json())
        .then(response => setResult({ status: 'loaded', payload: response }))
        .catch(error => setResult({ status: 'error', error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return result;
};

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

    async updateCart (session, products, promocode, lang) {
      return await fetch(
        `${MAIN_URL}/shoppingCarts/${session}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            sessionId: session,
            products,
            promocode,
            lang
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
        const url = new URL(process.env.REACT_APP_API_PROMOCODE);
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
