import CalendarItem from '../types/interface/calendar-item.interface';
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../constants";

const calendarItemListMock: CalendarItem[] =
    [
        {
            events: [ // put the array in the `events` property
                {
                    id: '1',
                    title  : 'event1',
                    content: 'event1 content',
                    isSucceed: false,
                    start  : '2024-08-03',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                // {
                //     id: '2',
                //     title  : 'event2',
                //     start  : '2024-08-05',
                //     end    : '2024-08-07',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '3',
                //     title  : 'event3',
                //     start  : '2024-09-12',
                //     end    : '2024-09-24',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '4',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '5',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '6',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '7',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '8',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '9',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '10',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '11',
                //     title  : 'event3',
                //     start  : '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // }
            ],
            color: 'black',     // an option!
            textColor: 'yellow' // an option!
        },
        // your event source
        {
            events: [ // put the array in the `events` property
                {
                    id: '12',
                    title: 'event2',
                    content: 'event2 content',
                    isSucceed: true,
                    start: '2024-08-03',
                    end: '',
                    url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                    editable: true
                },
                // {
                //     id: '13',
                //     title: 'event2',
                //     start: '2024-08-05',
                //     end: '2024-08-07',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // },
                // {
                //     id: '14',
                //     title: 'event3',
                //     start: '2024-08-09T12:30:00',
                //     end: '',
                //     url: `${BOARD_PATH()}/${BOARD_DETAIL_PATH(19)}`,
                //     editable: true
                // }
            ],
                color: 'grey',     // an option!
            textColor: 'white' // an option!
        }
]

export default calendarItemListMock;