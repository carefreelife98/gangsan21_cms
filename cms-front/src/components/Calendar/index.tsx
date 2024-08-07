import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import CalendarItem from '../../types/interface/calendar-item.interface';
import { EventClickArg } from '@fullcalendar/core';
import Modal from 'react-modal';
import CalendarMiniBoard from "./CalendarMiniBoardItem/CalendarMiniBoardItem";

import './style.css'


interface Props {
    calenderItemList: CalendarItem[];
}

Modal.setAppElement('#root');

export default function Calendar({ calenderItemList }: Props) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const handleModalSubmit = () => {

    };

    // event handler: 캘린더 내 날짜 선택/드래그 선택 시 업무 추가 모달 오픈
    const handleSelectDate = (selectInfo: any) => {
        setSelectedDate({ start: selectInfo.startStr, end: selectInfo.endStr });
        setModalIsOpen(true);
    };

    // event handler: 캘린더 내 이벤트 클릭 시 해당 업무 게시물로 이동.
    const handleEventClick = (info: EventClickArg) => {
        info.jsEvent.preventDefault(); // don't let the browser navigate

        if (info.event.url) {
            window.open(info.event.url);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                timeZone={'local'}
                initialView='dayGridMonth'
                headerToolbar={{ left: "prevYear,prev,next,nextYear today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
                dayMaxEventRows={true}
                selectable={true}
                select={handleSelectDate}
                eventSources={calenderItemList}
                eventClick={handleEventClick}
                locale='ko'
            />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Selected Date Modal"
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    },
                    content: {
                        position: 'relative',
                        width: '600px',
                        height: '900px',
                        overflowY: 'auto',  // 수직 스크롤을 활성화
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000
                    }
                }}
            >
                <form id={'calender-modal-form'} onSubmit={handleModalSubmit}>
                    <div className={'divider'}></div>
                    <h1>새로운 일정 등록</h1>
                    <div className={'calender-modal-form-wrapper'}>
                        <CalendarMiniBoard />
                        <div className='divider'/>
                    </div>
                    <input title={'시작일'} type={'date'} value={selectedDate.start}/>
                    <input title={'종료일'} type={'datetime-local'} value={selectedDate.end}/>
                    <div className={'calender-modal-form-button-box'}>
                        <button className={'calender-modal-form-button-submit'} form={'calender-modal-form'} type="submit">{'등록'}</button>
                        <button className={'calender-modal-form-button-cancel'} form={'calender-modal-form'} type="button" onClick={closeModal}>{'취소'}</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};