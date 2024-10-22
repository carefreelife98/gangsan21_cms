import React from 'react';
import './style.css';
import {BoardListItem} from "types/interface";
import {useNavigate} from "react-router-dom";
import defaultProfileImage from 'assets/image/default-profile-image.png'
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constants";
import dayjs from "dayjs";
import DOMPurify from "isomorphic-dompurify";

interface Props {
    boardListItem: BoardListItem
}


//           component: Board List Item 컴포넌트          //
export default function BoardItem({ boardListItem }: Props) {

    //           Properties           // : HTML Component 내에 들어갈 리소스 (boardListItem) 들을 받아와 삽입하여 노출.
    const { boardNumber, title, content, isSucceed, startDt, endDt, boardTitleImage } = boardListItem
    const { favoriteCount, commentCount, viewCount } = boardListItem
    const { writeDateTime, writerNickName, writerProfileImage } = boardListItem

    //           Function: 네비게이트 함수, `npm i install react-router-dom`           //
    const navigate = useNavigate();

    //           event handler: 게시물 아이템 클릭 이벤트 처리 함수          //
    const onClickHandler = () => {
        navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    };

    //           component: Board List Item 컴포넌트 렌더링          //
    return (
        <div className='board-list-item' onClick={onClickHandler}>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        {/* Profile image 가 없는 경우 Default image 사용 */}
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})`}}></div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>{writerNickName}</div>
                        <div className='board-list-item-write-date'>{dayjs(writeDateTime).format('YYYY. MM. DD. HH:mm')}</div>
                    </div>
                </div>
                <div className='board-list-item-middle'>
                    {(startDt || endDt) &&
                        <div className='board-list-item-util-box'>
                            <div className='board-list-item-date'>업무 기간: {dayjs(startDt).format('YY. MM. DD')} ~ {dayjs(endDt).format('YY. MM. DD')}</div>
                            <div className='board-list-item-is-succeed'>상태:
                                {
                                isSucceed ?
                                    <span className='board-success'>{'해결'}</span>
                                    :
                                    <span className='board-unsuccess'>{'진행 중'}</span>
                                }
                            </div>
                        </div>
                    }
                    <div className='board-list-item-title'>{title}</div>
                    <div className='board-list-item-content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>
                        {`댓글 ${commentCount} • 좋아요 ${favoriteCount} • 조회수 ${viewCount}`}
                    </div>
                </div>
            </div>

            {boardTitleImage !== null && (
                /* 게시물 썸네일이 존재할 경우에만 추가 */
                <div className='board-list-item-image-box'>
                    <div className='board-list-item-image' style={{backgroundImage: `url(${boardTitleImage})`}}></div>
                </div>
            )}
        </div>
    );
}
