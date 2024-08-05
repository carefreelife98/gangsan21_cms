import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {BoardListItem} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constants";
import dayjs from 'dayjs';

interface Props {
    top3ListItem: BoardListItem
}


//         component: Top 3 List Item 컴포넌트 렌더링         //
export default function Top3Item({ top3ListItem }: Props) {

    //         Properties:         //
    const { boardNumber, title, content, boardTitleImage } = top3ListItem;
    const { favoriteCount, commentCount, viewCount} = top3ListItem;
    const { writeDateTime, writerNickName, writerProfileImage} = top3ListItem;

    //         function: 네비게이트 함수         //
    const navigate = useNavigate();

    //           event handler: 게시물 아이템 클릭 이벤트 처리 함수          //
    const onClickHandler = () => {
        navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    };

    //         component: Top 3 List Item 컴포넌트 렌더링         //
    return (
        <div className='top-3-list-item' onClick={onClickHandler}>
            <div className='top-3-background-image' style={{backgroundImage: `url(${boardTitleImage})`}}></div>
            <div className='top-3-list-item-main-box'>
                <div className='top-3-list-item-top'>
                    <div className='top-3-list-item-profile-box'>
                        <div className='top-3-item-profile-image' style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})`}}></div>
                    </div>
                    <div className='top-3-list-item-write-box'>
                        <div className='top-3-list-item-nickname'>{writerNickName}</div>
                        <div className='top-3-list-item-write-date'>{dayjs(writeDateTime).format('YYYY. MM. DD. HH:MM')}</div>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='top-3-list-item-middle'>
                    <div className='top-3-list-item-title'>{title}</div>
                    <div className='top-3-list-item-content'>{content}</div>
                </div>
                <div className='top-3-list-item-bottom'>
                    <div className='top-3-list-item-counts'>
                        {`댓글 ${commentCount} • 좋아요 ${favoriteCount} • 조회수 ${viewCount}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
