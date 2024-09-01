import CalenderEvent from "../../../types/interface/calender-event.interface";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import './style.css';
import DOMPurify from "isomorphic-dompurify";

interface Props {
    boardItem: CalenderEvent | null;
}

export default function CalendarMiniViewItem({boardItem}: Props) {

    // state: 업무 시작일 설정 상태
    const [isStartDtExists, setStartDtExists] = useState<boolean>(false);

    // state: 업무 종료일 설정 상태
    const [isEndDtExists, setEndDtExists] = useState<boolean>(false);

    // effect: 초기 상태 설정
    useEffect(() => {

        setStartDtExists(!!boardItem?.start)
        setEndDtExists(!!boardItem?.end)

    }, []);

    if(!boardItem) return <></>
    return (
        <div id='mini-calendar-board-detail-top'>
            <div className='calendar-board-detail-top-header'>
                <h1 className='calendar-board-detail-header'>{'간편 업무 조회'}</h1>
                <div className='divider'></div>
                <div className='calendar-board-detail-title'>{boardItem.title}</div>
                <div className='divider'></div>
                <div className='calendar-board-detail-top-sub-box'>
                    <span className={'calendar-board-detail-issue-date-desc'}>
                        업무 기간:
                        {isStartDtExists &&
                            <div className='calendar-board-detail-issue-date'>
                                {dayjs(boardItem.start).format('YYYY. MM. DD. HH:mm')}
                            </div>
                        }
                        ~
                        {isEndDtExists &&
                            <div className='calendar-board-detail-issue-date'>
                                {dayjs(boardItem.end).format('YYYY. MM. DD. HH:mm')}
                            </div>
                        }
                    </span>
                    <div className='calendar-board-succeed-status'>상태:
                        {
                            boardItem.isSucceed ?
                                <span className='board-success'>{'해결'}</span>
                                :
                                <span className='board-unsuccess'>{'진행 중'}</span>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='calendar-board-detail-main-text'
                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(boardItem.content)}}/>
            </div>
        </div>
    );
}
