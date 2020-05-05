import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from "../../../api";
import LangContext from '../../App';
import { Tickets } from "../Tickets/Tickets";
import { Calendar } from "../Calendar/Calendar";
import { Time } from "../Time/Time";

let count = 0;

export const DirectionsList = ( { directions = [], selectedDirection, onChange = () => {} } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log(`${Directions.name} rerender: ${count}`);
  }

  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  const name = directions.map( ( { _key } ) => _key ).join('-');

  const renderDirections = directions.map( direction => {
    const { _key, title } = direction;
    const checked = _key === selectedDirection;

    return (
      <li key={ _key } className='grid-list__item'>
        <label
          className={ `btn-radio__label ${ checked ? 'btn-radio__label_checked' : '' }` }>
          { title[ t('locale') ] }
          <input
            type="radio"
            className='btn-radio'
            name={ name }
            value={ _key }
            checked={ checked }
            onChange={ () => onChange( _key ) }
          />
        </label>
      </li>
    );
  });

  return (
    renderDirections.length > 1
      ? <>
          <div className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Выберите направление' ) }</div>
          <ul className='grid-list'>
            { renderDirections }
          </ul>
        </>
      : null
  );
};

/* Функция принимает массив объектов направлений и возвпащает нормализованный объект,
где ключем является идентификатор направлния, а значением объект с данными о направлении. */
const normalise = ( array = [] ) => {
  return array.reduce( ( acc, item ) => {
    acc = acc || {};
    acc[ item._key ] = item;

    return acc;
  }, {} );
}

const getDates = ( normalisedDirections, { direction } ) => {
  let { nested, isEveryOwnDate, dates = [] } = normalisedDirections[ direction ];
  
  if ( nested ) {
    if ( isEveryOwnDate ) {
      alert( '[WIP]' ); // TODO: у каждого направления своя дата
    } else {
      nested.forEach( ({ _key }) => {
        const direction = normalisedDirections[ _key ];
        dates = dates.length
          ? dates.filter( date => direction.dates.indexOf( date ) !== -1 )
          : direction.dates;
      } );
      return dates;
    }
  } else {
    return dates;
  }
}

const getSelectedDirections = ( normalisedDirections, { direction } ) => {
  let { nested } = normalisedDirections[ direction ];
  
  const selectedDirections = nested
    ? nested.map( ( { _key } ) => normalisedDirections[ _key ] )
    : [ normalisedDirections[ direction ] ]

  return selectedDirections;
}

export const Directions = ( { product = {}, directions = [], options = { events: [] }, onChange = () => {} } ) => {
  const [ normalisedDirections, setNormalisedDirections ] = useState();
  const [ selectedDirections, setSelectedDirections ] = useState( [] )
  const [ dates, setDates ] = useState( [] );
  const [ times, setTimes ] = useState( [ { status: 'loading' } ] );

  /* По вызову комопнета ProductViewSelect массив направлений нормализуется – перезаписывается в нужный формат. */
  useEffect( () => {
    const _normalisedDirections = normalise( directions );
    setNormalisedDirections( _normalisedDirections );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect( () => {
    if ( normalisedDirections ) {
      setSelectedDirections( getSelectedDirections( normalisedDirections, options ) );
      setDates( getDates( normalisedDirections, options ) );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ options.direction, normalisedDirections ] )
  

  /* Функция меняет выбранное направление. */
  const onDirectionChange = ( direction ) => {
    onChange({
      ...options,
      direction,
      tickets: getEntity( 'tickets', direction ),
    })
  }

  /* Функция меняет выбранную дату. */
  const onDateChange = date => {
    if ( !options.direction || !selectedDirections ) return;

    const newTimes = [];
    const events = Object.assign( [], options.events );
    selectedDirections.forEach( async ( { _key }, index ) => {
      newTimes[ index ] = { status: 'loading' };
      setTimes( newTimes );
      
      try {
        const payload = await api.product.getProductTime( product._id, _key, date );
        payload.forEach( item => item.start = new Date( item.start ) );
        newTimes[ index ] = { status: 'loaded', payload };
        
        setTimes( newTimes );

        events[ index ] = payload.find( time => !time.expired );
        onChange( { ...options, events } )
      } catch ( error ) {
        setTimes( [ { status: 'error', error } ] );
      }
    } )
  }

  /* Функция меняет выбранное время. */
  const onTimeChange = ( event, direction ) => {
    const { nested } = normalisedDirections[ options.direction ];
    const index = nested ? nested.indexOf( item => item._key === direction ) : 0;
    const newEvents = Object.assign( [], options.events );
    newEvents[ index ] = event;

    onChange( {
      ...options,
      events: newEvents,
    } )
  }

  /* Функция меняет выбранные билеты. */
  const onTicketChange = ( key, count ) => {
    const tickets = { ...options.tickets };
    tickets[ key ] = count;
    
    onChange({
      ...options,
      tickets,
    })
  }

  const getEntity = ( entity, direction = options.direction ) => {
    if ( !normalisedDirections || !direction ) return [];
  
    return normalisedDirections[ direction ][ entity ] || []
  }
  
  return (
    <div className='product__inner'>
      <div className='colDesktop'>
        <DirectionsList directions={ directions } selectedDirection={ options.direction } onChange={ onDirectionChange } />
        <Calendar
          dates={ dates }
          selectedDate={ undefined }
          onChange={ onDateChange }
        />
      </div>
      <div className='colDesktop'>
        {
          options.events && selectedDirections
            ? selectedDirections.map( ( direction, index ) => times[ index ] && (
                <Time
                  key={ index }
                  times={ times[ index ] }
                  direction={ direction }
                  selectedTime={ options.events[ index ] }
                  onChange={ onTimeChange }
                />
              ) )
            : null
        }
        <Tickets
          tickets={ getEntity('tickets') }
          selectedTickets={ options.tickets }
          onChange={ onTicketChange }
        />
      </div>
    </div>
  )
}