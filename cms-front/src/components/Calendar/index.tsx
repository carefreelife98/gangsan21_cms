import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import CalendarItem from '../../types/interface/calendar-item.interface';
import { EventClickArg } from '@fullcalendar/core';
import Modal from 'react-modal';
import CalendarMiniBoard from "./CalendarMiniBoardItem/CalendarMiniBoardItem";

import './style.css'
import {useCookies} from "react-cookie";
import {AUTH_PATH, MAIN_PATH} from "../../constants";
import {useNavigate} from "react-router-dom";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, postBoardRequest} from "../../apis";
import {PostBoardRequestDto} from "../../apis/request/board";
import {ResponseDto} from "../../apis/response";
import {PostBoardResponseDto} from "../../apis/response/board";
import CalendarMiniViewItem from "./CalendarMiniViewItem/CalendarMiniViewItem";
import CalenderEvent from "../../types/interface/calender-event.interface";

interface Props {
    calenderItemList: CalendarItem[];
}

Modal.setAppElement('#root');

export default function Calendar({ calenderItemList }: Props) {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();
    // state: 로그인 유저 상태
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
    // state: 간편 업무 등록 모달 open 상태
    const [boardWriteModalIsOpen, setBoardWriteModalIsOpen] = useState(false);
    // state: 간편 업무 조회 모달 open 상태
    const [boardDetailModalIsOpen, setBoardDetailModalIsOpen] = useState(false);
    // state: 캘린더 내에서 마우스 클릭 / 드래그 이벤트를 통한 날짜 선택 상태
    const [selectedDateToWrite, setSelectedDateToWrite] = useState<{ start: string; end: string }>({ start: '', end: '' });
    // state: 캘린더 미니 뷰 이벤트 상태
    const [selectedEvent, setSelectedEvent] = useState<CalenderEvent | null>(null);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // component: 업로드 버튼 컴포넌트
    const UploadButton = () => {

        // state: 게시물 상태
        const {title, content, startDt, endDt, boardImageFileList, resetBoard} = useBoardStore();

        // function: post board response 처리 함수
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수 요소입니다.')
            if (code === 'DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') return;

            resetBoard();
            if (!loginUser) return;
            navigate(MAIN_PATH());
        };

        // event handler: 업로드 버튼 클릭 이벤트 처리 함수
        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            const boardImageList: string[] = [];

            // 이미지 업로드 api 를 통해 각 이미지 파일을 업로드 한 후,
            // 반환 값으로 저장된 url 값을 가져와 boardImageList 배열에 저장.
            for (const file of boardImageFileList) {
                const data = new FormData();
                data.append('file', file);

                const url = await fileUploadRequest(data);
                if (url) boardImageList.push(url)
            }

            // 게시물 작성 상태인지 확인 (경로를 통해)
            const requestBody: PostBoardRequestDto = {
                title, content, startDt, endDt, boardImageList
            };
            postBoardRequest(requestBody, accessToken).then(postBoardResponse);
        };

        if(title && content)
            // render: 업로드 버튼 컴포넌트 렌더링
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        // render: 업로드 불가 버튼 컴포넌트 렌더링
        return <div className='disable-button' >{'업로드'}</div>;
    };

    // event handler: 캘린더 내 날짜 선택/드래그 선택 시 업무 추가 모달 오픈
    const handleSelectDateToWrite = (selectInfo: any) => {
        setSelectedDateToWrite({ start: selectInfo.startStr, end: selectInfo.endStr });
        setBoardWriteModalIsOpen(true);
    };

    // event handler: 캘린더 내 업무 클릭 시 간편 조회 모달 오픈
    const handleSelectToDetail = (info: EventClickArg) => {
        info.jsEvent.preventDefault(); // don't let the browser navigate

        // Main 컴포넌트에서 넘어온 캘린더 아이템 리스트 에서 클릭 이벤트가 발생한 이벤트(업무) 추출.
        calenderItemList.map((calendarItem, index) => {
            calendarItem.events.map((item, index) => {
                if (item.id === info.event.id) {
                    setSelectedEvent(item);
                }
            });
        });
        setBoardDetailModalIsOpen(true);

        // 해당 업무 상세 페이지 이동 로직 fade out.
        // if (info.event.url) {window.open(info.event.url);}
    };

    const closeWriteModal = () => {
        setBoardWriteModalIsOpen(false);
    };

    const closeDetailModal = () => {
        setBoardDetailModalIsOpen(false);
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, googleCalendarPlugin]}
                // googleCalendarApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                timeZone={'local'}
                initialView='dayGridMonth'
                headerToolbar={
                    {
                        left: "prevYear,prev,next,nextYear today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }
                }
                dayMaxEventRows={true}
                selectable={true}
                select={handleSelectDateToWrite}
                eventSources={calenderItemList}
                eventClick={handleSelectToDetail}
                locale={'ko'}
            />
            <Modal
                className='calender-detail-modal-content'
                overlayClassName='calender-detail-modal-overlay'
                isOpen={boardDetailModalIsOpen}
                onRequestClose={closeDetailModal}
            >
                <form id='calender-detail-modal-form'>
                    <div className='calender-detail-modal-form-wrapper'>
                        <CalendarMiniViewItem boardItem={selectedEvent}/>
                    </div>
                </form>
            </Modal>
            <Modal
                className='calender-write-modal-content'
                overlayClassName='calender-write-modal-overlay'
                isOpen={boardWriteModalIsOpen}
                onRequestClose={closeWriteModal}
            >
                <form id={'calender-write-modal-form'} >
                    <div className={'calender-write-modal-form-wrapper'}>
                        <CalendarMiniBoard startDtByCal={selectedDateToWrite.start} endDtByCal={selectedDateToWrite.end}/>
                        <div className='divider'/>
                        <div className={'calender-write-modal-form-button-box'}>
                            <UploadButton />
                            <button className={'button-cancel'} form={'calender-write-modal-form'} type="button" onClick={closeWriteModal}>{'취소'}</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};