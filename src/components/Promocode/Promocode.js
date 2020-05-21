import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Promocode = ({ isRightTranslate, promocode = '', sale = 0, onChange }) => {
  const { t } = useTranslation();
  const [ isShowPromocode, setIsShowPromocode ] = useState( !!promocode );
  const setPromocode = ( newPromocode ) => {
    onChange( newPromocode )
  }
  
  return (
    <div >
      {
        isShowPromocode
          ? <label className='form-label'>
          <span className='caption'>
            <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Промокод' ) } </span>
            {
              sale > 0 ? `«${ promocode.toUpperCase() }» на ${ sale }% 👍` : null
            }
          </span>
            <input
              className='input'
              name='promocode'
              defaultValue={promocode}
              onKeyUp={ e => setPromocode( e.target.value ) }
              autoComplete='off'
              autoFocus={isShowPromocode}
              onBlur={()=> !promocode && setIsShowPromocode(false)}
            />
          </label>
          : <button className={ 'btn-radio__label' + (isRightTranslate ? '' : ' translate' ) } onClick={ () => setIsShowPromocode(true) }>{ t('У меня есть промокод') }</button>
      }
    </div>
  )
}