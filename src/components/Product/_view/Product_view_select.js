import React, { useState, useEffect }  from 'react';
import { Calendar } from "../../Calendar/Calendar";
import { Directions } from "../../Directions/Directions";
import { useGetTimes, api } from "../../../api";
import { Time } from '../../Time/Time';

const normaliseDirections = ( directions = [] ) => {
  return directions.reduce( ( acc, direction ) => {
    acc = acc || {};
    acc[ direction._key ] = direction;

    return acc;
  }, {} );
}

export const ProductViewSelect = ({ lang, isRightTranslate, product, options, onChange }) => {
  const {
    name = 'Unnamed direction',
    key: { current: alias } = {},
  } = product.title[ lang ] || product.title[ process.env.REACT_APP_DEFAULT_LANG ] || {};
  const urlToProduct = alias;
  const { directions = [] } = product;
  const data = normaliseDirections( directions );
  const dates = options.direction ? data[ options.direction ].dates : [];
  const [ times, setTimes ] = useState({ status: 'loading' });
  const [ date, setDate ] = useState( options.time );
  
  const onDateChange = async (newDate, directionId = options.direction ) => {
    setDate( newDate );

    if ( !newDate || !directionId ) return;

    try {
      const _times = await api.product.getProductTime( product._id, directionId, newDate );
      setTimes( { status: 'loaded', payload: _times } );
    } catch ( error ) {
      setTimes( { status: 'error', error } );
    }
  };
  
  
  const onDirectionChange = directionId => {
    const _date = new Date( data[ directionId ].dates[ 0 ] );
    onDateChange( _date, directionId );
    onChange( {
      ...options,
      direction: directionId,
    } )
  }

  useEffect( () => {
    onDirectionChange( directions[ 0 ]._key );
  }, [] )
  
  
  const onTimeChange = ( event ) => {
    console.log( `event`, event );
  }

  return (
    <fieldset className='product product_view_form'>
      <legend className={'product__legend' + (isRightTranslate ? '' : ' translate')}>
        <a href={ urlToProduct } className="Link Link_view_inherit">
          { name }
        </a>
      </legend>
      <div className='product__inner'>
        <div className='colDesktop'>
          {
            directions && <Directions
              lang={ lang }
              isRightTranslate={ isRightTranslate }
              directions={ directions.filter( direction => direction.dates ) }
              selectedDirection={ options.direction }
              onChange={ onDirectionChange }
            />
          }
          {
            dates && date && <Calendar
              lang={lang}
              isRightTranslate={isRightTranslate}
              dates={ dates }
              selectedDate={ date }
              onChange={ onDateChange }
            />
          }
        </div>
        <div className='colDesktop'>
          <pre>
            <code>
              {
                times.status === 'loaded' && <Time
                  lang={ lang }
                  isRightTranslate={ isRightTranslate }
                  times={ times.payload }
                  selectedTime={ options.event || times.payload[ 0 ] }
                  onChange={ onTimeChange }
                />
              }
            </code>
          </pre>
        </div>
      </div>
    </fieldset>
  )
}