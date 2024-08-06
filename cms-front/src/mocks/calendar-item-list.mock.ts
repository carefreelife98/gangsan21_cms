import CalendarItem from '../types/interface/calendar-item.interface';
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../constants";

const calendarItemListMock: CalendarItem[] =
    [
        {
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start  : '2024-08-03',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event2',
                    start  : '2024-08-05',
                    end    : '2024-08-07',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-09-12',
                    end    : '2024-09-24',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                }
            ],
            color: 'black',     // an option!
            textColor: 'yellow' // an option!
        },
        // your event source
        {
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start: '2024-08-03',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event2',
                    start  : '2024-08-05',
                    end    : '2024-08-07',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                {
                    title  : 'event3',
                    start  : '2024-08-09T12:30:00',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                }
            ],
                color: 'grey',     // an option!
            textColor: 'white' // an option!
        }
]

export default calendarItemListMock;