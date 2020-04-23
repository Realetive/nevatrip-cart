import React, { useState, useEffect }  from 'react';
import { Calendar } from "../../Calendar/Calendar";
import { Directions } from "../../Directions/Directions";
import { api } from "../../../api";
import { Time } from '../../Time/Time';
import { Tickets } from '../../Tickets/Tickets';

const normalise = ( array = [] ) => {
  console.log( `normalise` );
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
  count += 1;
  console.log( `${ ProductViewSelect.name } rerender: ${ count }` );
  const { name, alias } = getTitle( product.title, lang );
  const { directions = [] } = product;
  const [ normalisedDirections, setNormalisedDirections ] = useState( {} );
  const [ times, setTimes ] = useState({ status: 'loading' });

  useEffect( () => {
    setNormalisedDirections( normalise( directions ) );
  }, [] );
  
  const onDirectionChange = ( direction ) => {
    console.log( `onDirectionChange`, direction );
    onChange({
      ...options,
      direction,
    })
  }

  const onDateChange = async date => {
    if ( !options.direction._key ) return;

    setTimes( { status: 'loading' } );
    try {
      const payload = await api.product.getProductTime( product._id, options.direction._key, date );
      setTimes( { status: 'loaded', payload } );
      // onChange( {
      //   ...options,
      //   event: payload[ 0 ],
      // } )
    } catch ( error ) {
      setTimes( { status: 'error', error } );
    }
  }
  
  const onTimeChange = time => {
    console.log( `time`, time );
  }

  const onTicketChange = ( key, count ) => {
    const normalizedTickets = normalise((normalisedDirections[ options.direction._key ] || {}).tickets);
    normalizedTickets[key].count = count;
    onChange({
      ...options,
      tickets: Object.values(normalizedTickets)
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
        <div className='colDesktop' style={{ maxWidth: '50%' }}>
          <Directions
              lang={ lang }
              isRightTranslate={ isRightTranslate }
              directions={ directions.filter( direction => direction.dates ) }
              selectedDirection={ options.direction }
              onChange={ onDirectionChange }
          />
          {
            normalisedDirections
            && options.direction
            && normalisedDirections.hasOwnProperty( options.direction._key )
            && <Calendar
              lang={lang}
              isRightTranslate={isRightTranslate}
              dates={ normalisedDirections[ options.direction._key ].dates }
              selectedDate={ ( options.event || {} ).start }
              onChange={ onDateChange }
            />
          }
        </div>
        <div className='colDesktop' style={{ maxWidth: '50%' }}>
          {/*<div>*/}
          {/*  <pre style={{ overflow: 'auto' }}>*/}
          {/*    <code>*/}
          {/*      {*/}
          {/*        JSON.stringify( times, null, 2 )*/}
          {/*      }*/}
          {/*    </code>*/}
          {/*  </pre>*/}
          {/*</div>*/}
          {
            normalisedDirections.hasOwnProperty( options.direction._key ) && <Time
              lang={ lang }
              isRightTranslate={ isRightTranslate }
              times={ times.payload }
              selectedTime={ options.event }
              onChange={ onTimeChange }
            />
          }
          { normalisedDirections.hasOwnProperty( options.direction._key ) && <Tickets
            // getStatus={props.getStatus}
            // setDisabledBtn={setDisabledBtn}
            // isDisabledBtn={isDisabledBtn}
            lang={lang}
            isRightTranslate={isRightTranslate}
            // ticketCategory={ticketCategory}
            // onTicketChange={setSelectedTickets}
            tickets={ normalisedDirections[ options.direction._key ].tickets }
            onChange={onTicketChange}
          /> }
        </div>
      </div>
    </fieldset>
  )

  /*
  
  const dates = options.direction ? data[ options.direction ].dates : [];
  
  const [ date, setDate ] = useState( options.time );

  useEffect( () => {
    onDirectionChange( directions[ 0 ]._key );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )
  
  const onDirectionChange = directionId => {
    const _date = new Date( data[ directionId ].dates[ 0 ] );
    onDateChange( _date, directionId );
    onChange( {
      ...options,
      direction: directionId,
    } )
  }
  
  const onDateChange = async (newDate, directionId = options.direction ) => {
    setDate( newDate );

    
  };

  const onTimeChange = event => {
    onChange( {
      ...options,
      event,
    } )
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
          
        </div>
      </div>
    </fieldset>
  )
  */
}