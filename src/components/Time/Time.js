import React from 'react';
import { useTranslation } from 'react-i18next';
// import moment from "moment-timezone";

// const tripTimeZone = 'Europe/Prague';
// const tripTimeZoneOffset = - moment.tz(tripTimeZone).utcOffset();
//
// function pad (value) {
//     return value < 10 ? '0' + value : value;
// }
//
// function formatOffset(offset) {
//     const sign = (offset > 0) ? "-" : "+";
//     const _offset = Math.abs(offset);
//     const hours = pad(Math.floor(_offset / 60));
//     const minutes = pad(_offset % 60);
//
//     return sign + hours + ":" + minutes;
// }

export const Time = ( props ) => {
    const { t } = useTranslation();
    const { isRightTranslate, lang, time, setTime, events, formatDate, eventGroup } = props;

    ( events || [] ).sort(( a, b ) => new Date( a.start ) - new Date( b.start ) );

    const renderTimes = events ? ( events || [] ).map( ( eventItem, index ) => {
        const currentDate = new Date( eventItem.start );
        const userTimeOffset = currentDate.getTimezoneOffset();
        const isOffset = eventItem.expired;

        currentDate.setMinutes(currentDate.getMinutes() + userTimeOffset - eventItem.timeOffset);

        const formatTime = currentDate.toLocaleTimeString( lang, { timeStyle: 'short' } );

        return (
            <li key={ eventItem._key }
                title={ isOffset ? t('Это время уже не доступно')  : `${formatDate} ${ formatTime }`  }
                className = 'grid-list__item'>
                <input
                    type="radio"
                    className = 'btn-radio'
                    name = { eventGroup }
                    value = { eventItem._key }
                    checked = { isOffset ? false : time ? time === eventItem._key : !index }
                    onChange = { e => setTime( e.target.value ) }
                    id = { eventItem._key }
                    disabled = { isOffset }
                />

                <label
                    className = { isOffset ? 'btn-radio__label btn-radio__label_disabled'  : 'btn-radio__label'  }
                    htmlFor = { eventItem._key }>
                    {formatTime}
                </label>
            </li>
        );
    } ) : [];

    // function checkLanguage(time) {
    //     if (document.documentElement.lang === "de") {
    //         return (
    //             `
    //             Anscheinend unterscheidet sich die Zeitzone der Tour von Ihrer (UTC${ time }).
    //             Die Abfahrtszeit ist in der örtlichen Zeitzone (UTC${ moment.tz(tripTimeZone).format('Z') }) angegeben.
    //           `
    //         );
    //     } else {
    //         return (
    //             `
    //               ${ t( 'Похоже, часовой пояс экскурсии отличается от вашего' ) } (UTC${ time }).
    //               ${ t( 'Указано отправление по местному времени' ) } (UTC${ moment.tz(tripTimeZone).format('Z') }).
    //           `
    //         );
    //     }
    // }

    return (
        <div>
            {/*{*/}
            {/*    userTimeOffset !== tripTimeZoneOffset &&*/}
            {/*    <div className='caption' style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e8b0c5' }}>*/}
            {/*        { checkLanguage( formatOffset(userTimeOffset) ) }*/}
            {/*    </div>*/}
            {/*}*/}
            <div className={ 'caption' + ( isRightTranslate ? '' : ' translate' ) }>{ t( 'Выберите время отправления' ) }</div>
            {
                <ul className='grid-list'>
                    { renderTimes }
                </ul>
            }
        </div>
    );
};
