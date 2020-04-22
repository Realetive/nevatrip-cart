import React  from 'react';

export const ProductViewPreview = ( { lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate, product, options } ) => {
  
  return (
    <pre>
      <code>
        {
          JSON.stringify( options, null, 2 )
        }
      </code>
    </pre>
  )
}