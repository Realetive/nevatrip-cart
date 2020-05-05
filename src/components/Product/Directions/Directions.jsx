import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from "../../../api";
import LangContext from '../../App';
import { Tickets } from "../Tickets/Tickets";
import { Calendar } from "../Calendar/Calendar";

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

export const Directions = ( { product = {}, directions = [], options = {}, onChange = () => {} } ) => {
  const [ normalisedDirections, setNormalisedDirections ] = useState();
  const [ times, setTimes ] = useState({ status: 'loading' });

  /* По вызову комопнета ProductViewSelect массив направлений нормализуется – перезаписывается в нужный формат. */
  useEffect( () => {
    setNormalisedDirections( normalise( directions ) );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );
  
  const selectedDirection = normalisedDirections ? normalisedDirections[ options.direction ] : {};
  const {
    nested,
    isEveryOwnDate = false,
    dates,
  } = selectedDirection;
  
  const [ complexDates, setComplexDates ] = useState( [] );

  useEffect( () => {
    if ( nested ) {
      if ( !isEveryOwnDate ) {
        let _dates = [];
        nested.forEach( ({ _key }) => {
          const direction = normalisedDirections[ _key ];
          if (_dates.length) {
            const allDays = _dates.concat( direction.dates );
            console.log( `--------------------allDays`, allDays );
            const crossDays = allDays.filter( date => direction.dates.indexOf( date ) != -1 );
            console.log( `--------------------crossDays`, crossDays );
            _dates = crossDays;
          } else {
            _dates = direction.dates;
          }
          console.log( `--------------complexDates`, _dates );
        } );
        setComplexDates( _dates );
      }
    }
  }, [ options.direction ] )
  

  /* Функция меняет выбранное направление. */
  const onDirectionChange = ( direction ) => {
    onChange({
      ...options,
      direction,
      tickets: getEntity( 'tickets', direction ),
    })
  }

  /* Функция меняет выбранную дату. */
  const onDateChange = async date => {
    if ( !options.direction ) return;

    setTimes( { status: 'loading' } );
    try {
      const payload = await api.product.getProductTime( product._id, options.direction, date );
      payload.forEach(item => item.start = new Date( item.start ));
      setTimes( { status: 'loaded', payload } );
      onChange( {
        ...options,
        event: payload.find( time => !time.expired ),
      } )
    } catch ( error ) {
      setTimes( { status: 'error', error } );
    }
  }

  /* Функция меняет выбранное время. */
  const onTimeChange = event => {
    onChange( {
      ...options,
      event,
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
          dates={ dates || complexDates }
          selectedDate={ undefined }
          onChange={ onDateChange }
        />
        <pre>
          <code>
            {
              JSON.stringify( { nested }, null, 2 )
            }
          </code>
        </pre>
        <pre>
          <code>
            {
              JSON.stringify( { isEveryOwnDate }, null, 2 )
            }
          </code>
        </pre>
        <pre>
          <code>
            {
              JSON.stringify( { dates }, null, 2 )
            }
          </code>
        </pre>
      </div>
      <div className='colDesktop'>
        <Tickets
          tickets={ getEntity('tickets') }
          selectedTickets={ options.tickets }
          onChange={ onTicketChange }
        />
      </div>
    </div>
  )
}