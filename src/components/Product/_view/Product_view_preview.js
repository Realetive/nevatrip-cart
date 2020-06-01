import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import LangContext from "../../App";
import { renderTime, renderDate } from '@nevatrip/date-formatter';

export const ProductViewPreview = ( { product, options } ) => {
  const { t } = useTranslation();
  const isRightTranslate = useContext( LangContext );
  const title = product.title[ t('locale') ] ? product.title[ t('locale') ].name : 'Unnamed direction';
  const events = options.events || [];
  const direction = product.directions.find( _direction => _direction._key === options.direction );

  const directionTitle = direction._type === 'complex'
    ? direction.nested.map((dir) => {
        const currentDirection = product.directions.find( _direction => _direction._key === dir._key );
        return currentDirection.title[ t('locale') ];
      })
    : direction.title[ t('locale') ] || '';

  /* Функция выводит выбранные билеты, их количество и цену. */
  const renderTicket = () => {
    return direction.tickets.map( ( { _key, price, ticket } ) => {
      const count = options.tickets[ _key ];

      if ( !count ) return null;

      const [ { title } ] = ticket;

      return (
        <li key={ _key } className='listPreviewTicketsLi'>
          <span className={ ( isRightTranslate ? '' : ' translate' ) }>{ title[ t('locale') ] }: </span>
          <span dangerouslySetInnerHTML={{__html: `${price}&nbsp;${t( 'currency' )} × ${ count } = ${count * price}&nbsp;${t( 'currency' )}`}} />
        </li>
      );
    } )
  };

  return (
    <fieldset className='listPreviewFieldset'>
      <legend className={ 'listPreviewLegend' + ( isRightTranslate ? '' : ' translate' ) }>{ title }</legend>
        { events && events.map(( event = {}, index ) => {
          const selectedTime = ( event || {} ).start;

          return event._key && (
            <ul className='listPreviewData' key={ index }>
              <li className='listPreviewDataLi'>
                <div className='listPreviewDataLi'>
                  <div className={'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate')}>
                    <b>{ t('дата') }</b>
                  </div>
                  <div className="listPreviewDataLi__p">{ renderDate(selectedTime, t('locale')) }</div>
                </div>

                <div className='listPreviewDataLi'>
                  <div className={ 'listPreviewDataLi__h' + ( isRightTranslate ? '' : ' translate' ) }>
                    <b>{ t( 'время' ) }</b>
                  </div>
                  <div className="listPreviewDataLi__p">
                    { renderTime( selectedTime, t('locale') ) }
                  </div>
                </div>
                <div className="listPreviewDataLi__p">{ renderDate(selectedTime) }</div>
              </div>
            </li>
            <li className='listPreviewDataLi'>
              <div className={'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate')}>
                <b>{ t('время') }</b>
              </div>
              <div className="listPreviewDataLi__p">
                { renderTime(selectedTime) }
              </div>
            </li>
          </ul>
        )
      })}
      { ( options.tickets && direction.dates && direction.dates.length !== 0 ) || ( direction._type === 'complex' && options.tickets )
        ? <div className='listPreviewTickets'>
          <div className={ 'listPreviewDataLi__h' + (isRightTranslate ? '' : ' translate') }>
            <b>{ t('тип билета') }</b>
          </div>
          <div className="listPreviewDataLi__p">
            { renderTicket() }
          </div>
        </div>
        : <p>Нет выбранных билетов.</p>
      }
    </fieldset>
  );
}