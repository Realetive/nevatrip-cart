import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStoreon from 'storeon/react';
import { api } from "../../api";
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

export const Time = ( { cartKey, productId, isRightTranslate, lang } ) => {
    const { t } = useTranslation();
    const { dispatch, event, order, direction: directions } = useStoreon( 'product', 'event', 'order', 'direction' );
    const [ { direction, date, event: selectedEvent } ] = order[ cartKey ].options;
    const [ time, setTime ] = useState( selectedEvent );

    const createFormateDate = date => {
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format( date );
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format( date );
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format( date );

        return `${year}-${month}-${day}`;
    };

    const formatDate = createFormateDate( new Date( date ) );
    const eventGroup = `${ productId }.${ direction }.${ formatDate }`;
    const events = event[ eventGroup ];

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

    useEffect(() => {
        const getTimes = async ( direction, date ) => {
            const scheduleDate = new Date( date );
            const formatDate = createFormateDate( scheduleDate );
            const times = await api.product.getProductTime( productId, direction, formatDate );

            if ( !times.length ) return;

            setTime( times[ 0 ]._key );
            dispatch('event/add', { [ `${ productId }.${ direction }.${ formatDate }` ]: times });
        };

        getTimes( direction, date );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ direction, date ]);

    useEffect(() => {
        if ( !event ) return;
        const scheduleDate = new Date( date );
        const formatDate = createFormateDate( scheduleDate );
        const events = event[ `${productId}.${direction}.${formatDate}` ] || [];
        const action = events.find(eventItem => eventItem._key === time );

        order[ cartKey ].options[ 0 ].event = action;

        dispatch('order/update', order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, event]);

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
