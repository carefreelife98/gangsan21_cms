import React, {useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import CalendarItem from '../../types/interface/calendar-item.interface';
import {EventClickArg} from '@fullcalendar/core';
import Modal from 'react-modal';
import CalendarMiniBoard from "./CalendarMiniBoardItem/CalendarMiniBoardItem";
// tippy.js와 event 객체에 필요한 타입을 지정합니다.
import tippy, { Instance } from 'tippy.js';


import './style.css'
import {useCookies} from "react-cookie";
import {AUTH_PATH, MAIN_PATH} from "../../constants";
import {useNavigate} from "react-router-dom";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {
    fileUploadRequest,
    patchBoardRequest,
    patchBoardSuccessToggleRequest,
    postBoardRequest
} from "../../apis";
import {PostBoardRequestDto} from "../../apis/request/board";
import {ResponseDto} from "../../apis/response";
import {
    PatchBoardResponseDto,
    PatchBoardSuccessToggleResponseDto,
    PostBoardResponseDto
} from "../../apis/response/board";
import CalendarMiniViewItem from "./CalendarMiniViewItem/CalendarMiniViewItem";
import CalenderEvent from "../../types/interface/calender-event.interface";
import CalendarMiniBoardUpdate from "./CalendarMiniBoardUpdateItem/CalendarMiniBoardUpdateItem";

interface CalendarItemProps {
    calenderItemList: CalendarItem[];
}

Modal.setAppElement('#root');

export default function Calendar({ calenderItemList }: CalendarItemProps) {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();
    // state: 로그인 유저 상태
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
    // state: 간편 업무 등록 모달 open 상태
    const [boardWriteModalIsOpen, setBoardWriteModalIsOpen] = useState(false);
    // state: 간편 업무 등록 모달 open 상태
    const [boardUpdateModalIsOpen, setBoardUpdateModalIsOpen] = useState(false);
    // state: 간편 업무 조회 모달 open 상태
    const [boardDetailModalIsOpen, setBoardDetailModalIsOpen] = useState(false);
    // state: 캘린더 내에서 마우스 클릭 / 드래그 이벤트를 통한 날짜 선택 상태
    const [selectedDateToWrite, setSelectedDateToWrite] = useState<{ start: string; end: string }>({ start: '', end: '' });
    // state: 캘린더 미니 뷰 이벤트 상태
    const [selectedEvent, setSelectedEvent] = useState<CalenderEvent | null>(null);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // function: patchBoardSuccessToggleResponse 처리 함수
    const patchBoardSuccessToggleResponse = (responseBody: PatchBoardSuccessToggleResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if(code === 'NB') alert('존재하지 않는 게시물 입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        if (code === 'SU') {
            alert(`해당 업무의 상태가 ${selectedEvent?.isSucceed ? '\"진행중\"' : '\"해결\"'} 으로 변경되었습니다.`);
            window.location.reload();
            return;
        }
        return;
    };

    // function: 캘린더 내 Event 에 Mouse Hovering 시 발생하는 툴팁 처리 함수
    function setupTooltip(eventElement: HTMLElement, eventTitle: string): Instance {
        return tippy(eventElement, {
            content: eventTitle,
            placement: 'top-start', // tooltip 방향
            theme: 'yellow',
            arrow: true, // tooltip 말풍선 형태 출력 여부
        });
    }

    // component: 업로드 버튼 컴포넌트
    const UploadButton = () => {

        // state: 게시물 상태
        const {title, content, startDt, endDt, boardImageFileList, imageWidth, imageHeight, resetBoard} = useBoardStore();

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
                title, content, startDt, endDt, boardImageList, imageWidth, imageHeight
            };
            postBoardRequest(requestBody, accessToken).then(postBoardResponse);
        };

        if(title && content)
            // render: 업로드 버튼 컴포넌트 렌더링
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        // render: 업로드 불가 버튼 컴포넌트 렌더링
        return <div className='disable-button' >{'업로드'}</div>;
    };

    // component: 업로드 버튼 컴포넌트
    const UpdateButton = () => {

        // state: 게시물 상태
        const {title, content, startDt, endDt, boardImageFileList, imageWidth, imageHeight, resetBoard} = useBoardStore();

        // function: post board response 처리 함수
        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
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
        const onPatchButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            if (!selectedEvent?.id) {
                alert('해당 업무의 id 체크 과정에서 에러가 발생하였습니다. 새로 고침 후 다시 시도해주세요.');
                return;
            }

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
                title, content, startDt, endDt, boardImageList, imageWidth, imageHeight
            };

            patchBoardRequest(selectedEvent.id, requestBody, accessToken).then(patchBoardResponse);
        };

        if(title && content)
            // render: 업로드 버튼 컴포넌트 렌더링
            return <div className='black-button' onClick={onPatchButtonClickHandler}>{'수정'}</div>;
        // render: 업로드 불가 버튼 컴포넌트 렌더링
        return <div className='disable-button' >{'수정'}</div>;
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
    };

    // event handler: 업무 해결 상태 버튼 클릭 핸들러
    const onSuccessToggleButtonClickHandler = () => {
        if(selectedEvent === null) {
            alert('선택된 업무가 존재하지 않습니다. 새로고침 후 다시 시도해주세요.');
            return;
        }
        //TODO: "업무 완료" API 추가 및 연동
        const boardId = selectedEvent.id;
        patchBoardSuccessToggleRequest(boardId, cookies.accessToken).then(patchBoardSuccessToggleResponse);
    };

    const onDetailButtonClickHandler = () => {
        if (selectedEvent) {
            if (selectedEvent.url) {
                window.open(selectedEvent.url);
            } else {
                alert('선택한 업무가 데이터베이스에 존재하지 않습니다.');
            }
        }
    };

    const onUpdateButtonClickHandler = () => {
        setBoardDetailModalIsOpen(false);
        setBoardUpdateModalIsOpen(true);
    };

    const closeWriteModal = () => {
        setBoardWriteModalIsOpen(false);
    };

    const closeUpdateModal = () => {
        setBoardUpdateModalIsOpen(false);
    };

    const closeDetailModal = () => {
        setBoardDetailModalIsOpen(false);
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, googleCalendarPlugin, bootstrap5Plugin]}
                timeZone={'local'}
                // themeSystem={'bootstrap5'}
                initialView='dayGridMonth'
                headerToolbar={
                    {
                        left: "prevYear,prev,next,nextYear today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }
                }
                weekends={true}
                dayMaxEvents={false} // 각 날짜 별 이벤트 최대 개수 조절 (+more 버튼 노출 / 비노출)
                selectable={true}
                select={handleSelectDateToWrite}
                eventSources={calenderItemList}
                eventClick={handleSelectToDetail}
                eventDidMount={(info) => setupTooltip(info.el, info.event.title)}
                locale={'ko'}
            />
            <Modal
                className='calender-detail-modal-content'
                overlayClassName='calender-detail-modal-overlay'
                isOpen={boardDetailModalIsOpen}
                onRequestClose={closeDetailModal}
                style={{content: {width: '50%', height: '70%'}}}
            >
                <form id='calender-detail-modal-form'>
                    <div className='calender-detail-modal-form-wrapper'>
                        <CalendarMiniViewItem boardItem={selectedEvent}/>
                        <div className={'calender-write-modal-form-button-box'}>
                            {selectedEvent?.isSucceed ?
                                <div className='red-button' onClick={onSuccessToggleButtonClickHandler}>{'미해결'}</div>
                                :
                                <div className='blue-button' onClick={onSuccessToggleButtonClickHandler}>{'해결'}</div>
                            }
                            <div className='red-button' onClick={onUpdateButtonClickHandler}>{'업무 수정하기'}</div>
                            <div className='normal-button' onClick={onDetailButtonClickHandler}>{'업무 상세 보기'}</div>
                            <button className={'normal-button'} form={'calender-detail-modal-form'} type="button"
                                    onClick={closeDetailModal}>{'닫기'}</button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                className='calender-write-modal-content'
                overlayClassName='calender-write-modal-overlay'
                isOpen={boardWriteModalIsOpen}
                onRequestClose={closeWriteModal}
                style={{content: {width: '50%', height: '85%'}}}
            >
                <form id={'calender-write-modal-form'}>
                    <div className={'calender-write-modal-form-wrapper'}>
                        <CalendarMiniBoard startDtByCal={selectedDateToWrite.start}
                                           endDtByCal={selectedDateToWrite.end}/>
                        <div className='divider'/>
                        <div className={'calender-write-modal-form-button-box'}>
                            <UploadButton/>
                            <button className={'red-button'} form={'calender-write-modal-form'} type="button"
                                    onClick={closeWriteModal}>{'취소'}</button>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                className='calender-update-modal-content'
                overlayClassName='calender-update-modal-overlay'
                isOpen={boardUpdateModalIsOpen}
                onRequestClose={closeUpdateModal}
                style={{content: {width: '50%', height: '85%'}}}
            >
                <form id={'calender-update-modal-form'}>
                    <div className={'calender-update-modal-form-wrapper'}>
                        <CalendarMiniBoardUpdate boardNumber={selectedEvent?.id!!}/>
                        <div className='divider'/>
                        <div className={'calender-update-modal-form-button-box'}>
                            <UpdateButton/>
                            <button className={'red-button'} form={'calender-update-modal-form'} type="button"
                                    onClick={closeUpdateModal}>{'취소'}</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};