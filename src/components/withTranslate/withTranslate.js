import React from 'react';

export const withTranslate = ( HOCComponent ) => {
  const TranslateComponent = ( lang = process.env.REACT_APP_DEFAULT_LANG, isRightTranslate = true, ...props ) => {
    const NewProps = {
      ...props,
      lang,
      isRightTranslate,
    }

    return <HOCComponent { ...NewProps } />
  }
  
  return (props) => <TranslateComponent { ...props } />;
};
