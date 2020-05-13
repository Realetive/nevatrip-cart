import { useState, useEffect } from 'react';
import { MAIN_URL } from './config';

const headers = { 'Content-Type': 'application/json' };

/* Кастомный хук, который получет сессию и язык, запрашивает продукт и возвращает объект cart с данными и функцию, для изменений.  */
export const useGetOrder = ( session, lang = 'en' ) => {
  const [ cart, setCart ] = useState({ status: 'loading' });

  useEffect(() => {
    if (session) {
      fetch(`${MAIN_URL}/shoppingCarts/${session}`)
        .then( response => response.json() )
        .then( cart => {
          if ( !cart.products ) setCart({ status: 'loaded', payload: cart });

          const ids = cart.products.map( ( { productId } ) => productId );
          const uniqueIds = [ ...new Set( ids ) ];
          
          const getProducts = uniqueIds.map( id => fetch(`${MAIN_URL}/product/${ id }/cart?lang=${ lang }&ttl=3600000`).then( resp => resp.json() ) )
          
          Promise.allSettled( getProducts ).then( products => {
            const _products = {};

            products.forEach( (product) => {
              if ( product.status === "fulfilled" ) {
                _products[ product.value._id ] = product.value
              }
            });

            cart.products.forEach( product => {
              product.product = _products[ product.productId ];

              const [ firstDirection ] = _products[ product.productId ].directions;
              const getTickets = ( tickets ) => tickets.reduce( ( acc, ticket ) => {
                acc[ ticket._key ] = ticket.count || 0;

                return acc;
              }, {} );
              const {
                direction = firstDirection._key,
                tickets = getTickets( firstDirection.tickets ),
                events = [],
              } = product.options || {};

              product.options = { direction, tickets, events }
            } );

            setCart({ status: 'loaded', payload: cart })
          } )
        })
        .catch(error => setCart({ status: 'error', error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return [ cart, setCart ];
};

export const useGetTimes = (id, direction, date) => {
  const [result, setResult] = useState({
    status: 'loading'
  });

  const createFormateDate = date => {
    const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
  
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if ( id && direction && date ) {
      setResult({ status: 'loading' });
      fetch( `${ MAIN_URL }/product/${ id }/schedule/${ direction }/${ createFormateDate( date ) }`)
        .then(response => response.json())
        .then(response => setResult({ status: 'loaded', payload: response }))
        .catch(error => setResult({ status: 'error', error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id, direction, date ] );

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
      const createFormateDate = date => {
        const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
        const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
        const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
      
        return `${year}-${month}-${day}`;
      };
      const response = await fetch(
        `${MAIN_URL}/product/${productId}/schedule/${directionId}/${createFormateDate( date )}?ttl=3600000`,
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
