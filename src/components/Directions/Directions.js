import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';

export const Directions = ({ cartKey, productId }) => {
  const { dispatch, product, direction, order } = useStoreon('product', 'direction', 'order');
  const { directions } = product[productId];
  const defaultDirectionKey = ((order[cartKey] || {}).options || [{}])[0].direction || direction[directions[0]]._key;
  const [selectedDirection, _setDirection] = useState(defaultDirectionKey);

  useEffect(() => {
    order[cartKey].options = order[cartKey].options || [{}];
    order[cartKey].options[0].direction = selectedDirection;
    dispatch('order/update', order);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDirection])

  const renderDirections = directions.map((directionId) => {
    const {
      _key,
      title,
    } = direction[directionId];

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
          <span className='caption'>Выберите направление</span>
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
