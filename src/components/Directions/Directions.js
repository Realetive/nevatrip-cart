import React from 'react';
import { useTranslation } from 'react-i18next';

let count = 0;

export const Directions = ( { lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate = true, directions = [], selectedDirection, onChange = () => {} } ) => {
  count += 1;
  console.log( `${ Directions.name } rerender: ${ count }` );
  const { t } = useTranslation();
  const name = directions.map( ( { _key } ) => _key ).join('-');

  const renderDirections = directions.map( direction => {
    const {
      _key,
      title,
    } = direction;
    
    const checked = _key === selectedDirection;
    
    return (
      <li key={ _key }
        // title={ date.isOffset ? t( 'Это время уже не доступно' ) : `${ formatDate } ${ formatTime }`}
        className='grid-list__item'>

        <label
          className={ `btn-radio__label ${ checked ? 'btn-radio__label_checked' : '' }` }>
          { title[ lang ] }
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
