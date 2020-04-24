import React, { useState, useEffect }  from 'react';
import { Calendar } from "../../Calendar/Calendar";
import { Directions } from "../../Directions/Directions";
import { api } from "../../../api";
import { Time } from '../../Time/Time';
import { Tickets } from '../../Tickets/Tickets';
import '../Product.css'

const normalise = ( array = [] ) => {
  return array.reduce( ( acc, item ) => {
    acc = acc || {};
    acc[ item._key ] = item;

    return acc;
  }, {} );
}

const getTitle = ( title, lang ) => {
  const {
    name = 'Unnamed direction',
    key: { current: alias } = {},
  } = title[ lang ] || title[ process.env.REACT_APP_DEFAULT_LANG ] || {};

  return { name, alias };
}

let count = 0;

export const ProductViewSelect = ({ lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate, product, options, onChange }) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log( `${ ProductViewSelect.name } rerender: ${ count }` );
  }
  const { name, alias } = getTitle( product.title, lang );
  const { directions = [] } = product;
  const [ normalisedDirections, setNormalisedDirections ] = useState();
  const [ times, setTimes ] = useState({ status: 'loading' });

  useEffect( () => {
    setNormalisedDirections( normalise( directions ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const onDirectionChange = ( direction ) => {
    onChange({
      ...options,
      direction,
      tickets: get( 'tickets', direction ),
    })
  }

  const onDateChange = async date => {
    if ( !options.direction._key ) return;

    setTimes( { status: 'loading' } );
    try {
      const payload = await api.product.getProductTime( product._id, options.direction._key, date );
      payload.forEach(item => item.start = new Date( item.start ));
      setTimes( { status: 'loaded', payload } );
      onChange( {
        ...options,
        event: payload[ 0 ],
      } )
    } catch ( error ) {
      setTimes( { status: 'error', error } );
    }
  }

  const onTimeChange = event => {
    onChange( {
      ...options,
      event,
    } )
  }
  
  const get = ( entity, direction = options.direction ) => {
    if ( !normalisedDirections || !direction ) return [];

    return normalisedDirections[ direction._key ][ entity ] || []
  }

  const onTicketChange = ( key, count ) => {
    const normalizedTickets = normalise( get('tickets') );
    normalizedTickets[key].count = count;
    onChange({
      ...options,
      tickets: Object.values( normalizedTickets )
    })
  }

  return (
    <fieldset className='product product_view_form'>
      <legend className={'product__legend' + (isRightTranslate ? '' : ' translate')}>
        <a href={ alias } className="Link Link_view_inherit">
          { name }
        </a>
      </legend>
      <div className='product__inner'>
        <div className='colDesktop'>
          <Directions
            lang={ lang }
            isRightTranslate={ isRightTranslate }
            directions={ directions.filter( direction => direction.dates ) }
            selectedDirection={ options.direction }
            onChange={ onDirectionChange }
          />
          <Calendar
            lang={lang}
            isRightTranslate={ isRightTranslate }
            dates={ get('dates') }
            selectedDate={ (options.event || {} ).start }
            onChange={ onDateChange }
          />
        </div>
        <div className='colDesktop'>
          <Time
            lang={ lang }
            isRightTranslate={ isRightTranslate }
            times={ times }
            selectedTime={ options.event }
            onChange={ onTimeChange }
          />
          <Tickets
            lang={lang}
            isRightTranslate={ isRightTranslate }
            tickets={ get('tickets') }
            onChange={ onTicketChange }
          />
        </div>
      </div>
    </fieldset>
  )
}