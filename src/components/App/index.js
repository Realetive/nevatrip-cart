import React from 'react';

const LangContext = React.createContext( true );

export const LangProvider = LangContext.Provider;

export default LangContext;
