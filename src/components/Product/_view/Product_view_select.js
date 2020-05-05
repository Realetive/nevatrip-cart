import React, { useState, useEffect, useContext }  from 'react';
import { useTranslation } from 'react-i18next';
import { Directions } from "../Directions/Directions";
// import { Calendar } from "../../Calendar/Calendar";
// import { Time } from '../../Time/Time';
// import { Tickets } from '../../Tickets/Tickets';
import '../Product.css'
import LangContext from '../../App';


/* Функция возвращает заголовок экскурсии в нужном язке, если он объявлен, иначе возвращает заголовок на аглийском языке.
Если не находит и на английском, то возвращает значение по умолчанию. */
const getTitle = ( title, lang ) => {
  const {
    name = 'Unnamed direction',
    key: { current: alias } = {},
  } = title[ lang ] || title[ process.env.REACT_APP_DEFAULT_LANG ] || {};

  return { name, alias };
}

let count = 0;

export const ProductViewSelect = ({ product, options, onChange }) => {
  if ( process.env.NODE_ENV === 'development' ) {
    count += 1;
    console.log( `${ ProductViewSelect.name } rerender: ${ count }` );
  }
  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  const { name, alias } = getTitle( product.title, t('locale') );
  const { directions = [] } = product;

  const onOptionsChange = (newOptions) => {
    console.log( `newOptions`, newOptions );

    onChange({
      ...options,
      ...newOptions,
    })
  }

  return (
    <fieldset className='product product_view_form'>
      <legend className={'product__legend' + (isRightTranslate ? '' : ' translate')}>
        <a href={ alias } className="Link Link_view_inherit">
          { name }
        </a>
      </legend>
      <Directions
        product={ product }
        directions={ directions }
        options={ options }
        onChange={ onOptionsChange } 
      />
      {/* <div className='product__inner'>
        <div className='colDesktop'>
          <Directions
            directions={ directions.filter( direction => direction.nested || direction.dates ) }
            selectedDirection={ options.direction }
            onChange={ onDirectionChange }
          />
          <Calendar
            lang={lang}
            isRightTranslate={ isRightTranslate }
            dates={ getEntity('dates') }
            selectedDate={ options.event.start }
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
        </div>
      </div> */}
    </fieldset>
  )
}