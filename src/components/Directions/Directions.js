import React from 'react';




export const Directions = ( { lang, isRightTranslate, selectedDirection, directions, onChange } ) => {
  const renderDirections = directions.map( ( direction ) => {
    const {
      _key,
      title,
    } = direction;
    
    return (
      <option key={ _key } value={ _key }>
        { title[ lang ] }
      </option>
    );
  });
  
  const getSelectedDirection = _directions => {
    if ( _directions.map( ( { _key } ) => _key ).includes( selectedDirection ) ) {
      return selectedDirection;
    } else {
      const firstDirection = _directions[ 0 ]._key;
      onChange( firstDirection );
      return firstDirection;      
    }
  }
  
  const selected = getSelectedDirection( directions );

  return (
    true // renderDirections.length > 1
      ? <label>
          <span className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>Выберите направление</span>
          <select
            value={ selected }
            onChange={ event => onChange( event.target.value ) }
            className='input'
          >
          { renderDirections }
        </select>
      </label>
      : null
  );
};
