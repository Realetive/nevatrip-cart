import React from 'react';
import { useTranslation } from 'react-i18next';

export const Time = ( props ) => {
  const { t } = useTranslation();
  const { lang, time, setTime, formatDate, index, date } = props;

  const formatTime = date.currentDate.toLocaleTimeString( lang, { timeStyle: 'short' } );

  return (
      <li key={ date.key }
          title={ date.isOffset ? t('Это время уже не доступно')  : `${formatDate} ${ formatTime }`  }
          className = 'grid-list__item'>
          <input
              type="radio"
              className = 'btn-radio'
              name = { date.inputName }
              value = { date.key }
              checked = { date.isOffset ? false : time ? time === date.key : !index }
              onChange = { e => setTime( e.target.value ) }
              id = { date.key }
              disabled = { date.isOffset }
          />

          <label
              className = { date.isOffset ? 'btn-radio__label btn-radio__label_disabled'  : 'btn-radio__label'  }
              htmlFor = { date.key }>
              { formatTime }
          </label>
      </li>
  );
};
