import CalenderEvent from "../../../types/interface/calender-event.interface";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import './style.css';
import DOMPurify from "isomorphic-dompurify";
import {getBoardImageUrlsRequest} from "../../../apis";
import {useCookies} from "react-cookie";
import {GetBoardImageUrlsResponseDto} from "../../../apis/response/util";
import {ResponseDto} from "../../../apis/response";

interface Props {
    boardItem: CalenderEvent | null;
}

export default function CalendarMiniViewItem({boardItem}: Props) {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();

    // state: 업무 시작일 설정 상태
    const [isStartDtExists, setStartDtExists] = useState<boolean>(false);
    // state: 업무 종료일 설정 상태
    const [isEndDtExists, setEndDtExists] = useState<boolean>(false);
    // state: 보드 이미지 url 상태
    const [boardImageUrls, setBoardImageUrls] = useState<string[]>([]);


    // function: getBoardImageUrlsResponse 처리 함수
    const getBoardImageUrlsResponse = (responseBody: GetBoardImageUrlsResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody as GetBoardImageUrlsResponseDto;

        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code === 'VF') alert('연결 시간이 초과되었습니다. 다시 로그인 해주세요.');
        if(code !== 'SU') return;

        if (code === 'SU') {
            const {imageUrls} = responseBody as GetBoardImageUrlsResponseDto;
            imageUrls ? setBoardImageUrls(imageUrls) : setBoardImageUrls([]);
        }
    };

    // effect: 초기 상태 설정
    useEffect(() => {

        if (boardItem) {
            getBoardImageUrlsRequest(cookies.accessToken, boardItem.id).then(getBoardImageUrlsResponse);
            setStartDtExists(!!boardItem.start)
            setEndDtExists(!!boardItem.end)
        }

    }, [boardItem]);

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
                <div className='calendar-board-detail-main-text' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(boardItem.content)}}/>
                {boardImageUrls &&
                    boardImageUrls.map((image, index) =>
                    <img key={index} className='board-detail-main-image' src={image} alt={'게시물 상세 이미지'} style={{width: boardItem.imageWidth, height: boardItem.imageHeight}}/>)}
            </div>
        </div>
    );
}
