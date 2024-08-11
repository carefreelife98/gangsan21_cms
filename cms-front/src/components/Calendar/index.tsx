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
import {useCookies} from "react-cookie";
import {AUTH_PATH, MAIN_PATH} from "../../constants";
import {useNavigate} from "react-router-dom";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, postBoardRequest} from "../../apis";
import {PostBoardRequestDto} from "../../apis/request/board";
import {ResponseDto} from "../../apis/response";
import {PostBoardResponseDto} from "../../apis/response/board";


interface Props {
    calenderItemList: CalendarItem[];
}

Modal.setAppElement('#root');

export default function Calendar({ calenderItemList }: Props) {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();
    // state: 로그인 유저 상태
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
    // state: 모달 open 상태
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // state: 캘린더 내에서 마우스 클릭 / 드래그 이벤트를 통한 날짜 선택 상태
    const [selectedDate, setSelectedDate] = useState<{ start: string; end: string }>({ start: '', end: '' });

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
                className='calender-modal-content'
                overlayClassName='calender-modal-overlay'
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Selected Date Modal"
            >
                <form id={'calender-modal-form'} >
                    <div className={'calender-modal-form-wrapper'}>
                        <CalendarMiniBoard startDtByCal={selectedDate.start} endDtByCal={selectedDate.end}/>
                        <div className='divider'/>
                        <div className={'calender-modal-form-button-box'}>
                            <UploadButton />
                            <button className={'calender-modal-form-button-cancel'} form={'calender-modal-form'} type="button" onClick={closeModal}>{'취소'}</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};