import React  from 'react';
import { Calendar } from "../../Calendar/Calendar";
import { Directions } from "../../Directions/Directions";

const destructDirections = ( directions = [] ) => {
  return directions.reduce( (acc, direction) => {
    acc.dates = acc.dates || {};
    direction.dates.forEach( date => {
      acc.dates[ date ] = date;
    } )
    acc.directions = acc.directions || {};
    acc.directions[ direction._key ] = direction;
    
    return acc;
  }, {} );
}

// const createFormateDate = date => {
//   const year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
//   const month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
//   const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
//
//   return `${year}-${month}-${day}`;
// };

export const ProductViewSelect = ({ lang, isRightTranslate, product, options, onChange }) => {
  const { directions = [] } = product;
  const data = destructDirections( directions );
  const dates = Object.keys( data.dates );
  console.log(product.title)
  const {
    name,
    key: { current: alias },
  } = product.title[ lang ] || {
    name: 'Unnamed direction',
    key: ''
  };
  const urlToProduct = alias;

  const onDirectionChange = direction => {
    onChange( {
      ...options,
      direction,
    } )
  }
  
  const onDateChange = async (date) => {
    console.log( `date`, date );
    // const scheduleDate = new Date( date );
    // const formatDate = createFormateDate(scheduleDate);
    // const times = await api.product.getProductTime(product._id, options.direction, formatDate) || [];
    // console.log( `times`, times );

    // const _times = times.map( eventItem => {
    //   const currentDate = new Date( eventItem.start );
    //   const userTimeOffset = currentDate.getTimezoneOffset();

    //   currentDate.setMinutes(currentDate.getMinutes() + userTimeOffset - eventItem.timeOffset);

    //   return {
    //     currentDate,
    //     isOffset: eventItem.expired,
    //     key: eventItem._key,
    //     // inputName: eventGroup,
    //   };
    // })

    // setSelectedTime( getSelectedTime( _times ) );
    // setAvalibleTimes( _times );
  };
  
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
            dates && <Calendar
              lang={lang}
              isRightTranslate={isRightTranslate}
              dates={dates}
              selectedDate={ options.time }
              onChange={ onDateChange }
            />
          }
        </div>
        <div className='colDesktop'>
          {
            directions && <Directions
              lang={ lang }
              isRightTranslate={ isRightTranslate }
              directions={ directions }
              selectedDirection={ options.direction }
              onChange={ onDirectionChange }
            />
          }
        </div>
      </div>
    </fieldset>
  )
}