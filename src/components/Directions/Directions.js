import React from 'react';

export const Directions = ( props ) => {
    const { isRightTranslate, directionsId, selectedDirection, _setDirection, directions } = props;
    const renderDirections = directionsId.map((directionId) => {
    const {
      _key,
      title,
    } = directions[directionId];

    return (
      <option
        key = { _key }
        value = { _key }>
        { title }
      </option>
    );
    });

    return (
        renderDirections.length > 1
          ? <label>
              <span className={ 'caption'  + ( isRightTranslate ? '' : ' translate' ) }>Выберите направление</span>
              <select
                value={selectedDirection}
                onChange={ event => _setDirection(event.target.value) }
                className = 'input'
              >
                {renderDirections}
              </select>
            </label>
          : null
    );
};
