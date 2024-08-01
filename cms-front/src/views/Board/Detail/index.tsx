import './style.css';
import FavoriteItem from "../../../components/FavoriteItem";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Board, CommentListItem, FavoriteListItem} from "../../../types/interface";
import CommentItem from "../../../components/CommentItem";
import Pagination from "../../../components/Pagination";
import {useLoginUserStore} from "../../../stores";
import {useNavigate, useParams} from "react-router-dom";

import defaultProfileImage from 'assets/image/default-profile-image.png';
import {BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "../../../constants";
import {
    getBoardRequest,
    getCommentListRequest,
    getFavoriteListRequest,
    increaseViewCountRequest,
    putFavoriteRequest
} from "../../../apis";
import GetBoardResponseDto from "../../../apis/response/board/get-board.response.dto";
import {ResponseDto} from "../../../apis/response";
import {useCookies} from "react-cookie";
import {
    GetCommentListResponseDto,
    GetFavoriteListResponseDto,
    IncreaseViewCountResponseDto, PutFavoriteResponseDto
} from "../../../apis/response/board";

import dayjs from 'dayjs';

//          component: 게시물 상세 화면 컴포넌트          //
export default function BoardDetail() {

    // state: 게시물 번호 Path Variable 상태
    const { boardNumber } = useParams();
    // state: 로그인 유저 상태
    const { loginUser } = useLoginUserStore();
    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();


    // function: 네비게이트 함수
    const navigator = useNavigate();

    // function: Increase View Count Response 처리 함수
    const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === 'NB') alert('존재하지 않는 게시물 입니다.')
        if (code === 'DBE') alert('데이터 베이스 오류입니다.')
    };

    // component: 게시물 상세 상단 컴포넌트
    const BoardDetailTop = () => {

        // state: 작성자 여부 상태
        const [isWriter, setWriter] = useState<boolean>(false);

        // state: Board 상태
        const [board, setBoard] = useState<Board | null>(null);

        // state: more 버튼 상태
        const [showMore, setShowMore] = useState<boolean>(false);

        // function: 작성일 포맷 변경 함수
        const getWriteDateTimeFormat = () => {
            if(!board) return '';
            const date = dayjs(board.writeDateTime);
            return date.format('YYYY. MM. DD.');
        };


        // function: getBoardResponse 처리 함수
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물 입니다.')
            if(code === 'DBE') alert('데이터베이스 오류입니다.')
            if (code !== 'SU') {
                navigator(MAIN_PATH());
                return;
            }

            const board: Board = {...responseBody as GetBoardResponseDto}
            setBoard(board);

            if (!loginUser) {
                setWriter(false);
                return;
            }
            const isWriter = loginUser.email === board.writerEmail;
            setWriter(isWriter);
        };

        // event handler: 닉네임 버튼 클릭 이벤트 처리
        const onNickNameClickHandler = () => {
            if(!board) return;

            navigator(USER_PATH(board.writerEmail))
        };

        // event handler: more 버튼 클릭 이벤트 처리
        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        };

        // event handler: update 버튼 클릭 이벤트 처리
        const onUpdateButtonClickHandler = () => {
            if (!board || !loginUser) return;
            if (loginUser.email !== board.writerEmail) return;
            navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber))
        };

        // event handler: delete 버튼 클릭 이벤트 처리
        const onDeleteButtonClickHandler = () => {
            if (!board || !loginUser) return;
            if (loginUser.email !== board.writerEmail) return;
            // TODO: Delete request

            // 삭제 후 메인 페이지로 이동.
            navigator(MAIN_PATH())
        };

        // effect: 게시물 path variable 이 바뀔 때마다 게시물 불러오기
        useEffect(() => {
            const accessToken = cookies.accessToken;
            if(!accessToken) {
                console.log('cookie accessToken: ' + accessToken)
                navigator(MAIN_PATH());
                return;
            }
            if (!boardNumber) {
                navigator(MAIN_PATH());
                return;
            }

            getBoardRequest(boardNumber, accessToken).then(getBoardResponse)
        }, [boardNumber]);

        // render: 게시물 상세 상단 컴포넌트 렌더링
        if(!board) return <></>
        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>{board.title}</div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            <div className='board-detail-writer-profile-image'
                                 style={{backgroundImage: `url(${board.writerProfileImage ? board.writerProfileImage : defaultProfileImage})`}}>
                            </div>
                            <div className='board-detail-writer-nickname' onClick={onNickNameClickHandler}>{board.writerNickName}</div>
                            <div className='board-detail-info-divider'>{'|'}</div>
                            <div className='board-detail-write-date'>{getWriteDateTimeFormat()}</div>
                        </div>
                        {isWriter &&
                            <div className='icon-button' onClick={onMoreButtonClickHandler}>
                                <div className='icon more-icon'></div>
                            </div>
                        }
                        {showMore &&
                            <div className='board-detail-more-box'>
                                <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                                <div className='divider'></div>
                                <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>{board.content}</div>
                    {board.boardImageList.map(image => <img className='board-detail-main-image' src={image} />)}
                </div>
            </div>
        );
    };

    // 게시물 상세 하단 컴포넌트
    const BoardDetailBottom = () => {

        // state: 댓글 textarea 참조 상태
        const commentRef = useRef<HTMLTextAreaElement | null>(null)
        // state: 좋아요 리스트 상태
        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        // state: 댓글 리스트 상태
        const [commentList, setCommentList] = useState<CommentListItem[]>([]);
        // state: 좋아요 상태
        const [isFavorite, setFavorite] = useState<boolean>(false);
        // state: 좋아요 상자 보기 상태
        const [showFavorite, setShowFavorite] = useState<boolean>(false);
        // state: 댓글 상자 보기 상태
        const [showComment, setShowComment] = useState<boolean>(false);
        // state: 댓글 상태
        const [comment, setComment] = useState<string>('');


        // function: getFavoriteListResponse 처리 함수
        const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const {favoriteList} = responseBody as GetFavoriteListResponseDto;
            setFavoriteList(favoriteList);

            if(!loginUser) {
                setFavorite(false);
                return;
            }
            const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
            setFavorite(isFavorite);
        };

        // function: getCommentListResponse 처리 함수
        const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const {code} = responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const {commentList} = responseBody as GetCommentListResponseDto;
            setCommentList(commentList);
        };

        // function: getFavoriteListResponse 처리 함수
        const putFavoriteResponse = (responseBody: PutFavoriteResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const {code} = responseBody;

            if (code === 'VF') alert('잘못된 접근입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.')
            if (code === 'NB') alert('존재하지 않는 게시물입니다.')
            if (code === 'AF') alert('인증에 실패했습니다.')
            if (code === 'DBE') alert('데이터베이스 오류입니다.')
            if (code !== 'SU') return;

            if(!boardNumber) return;
            getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
        };

        // event handler: 좋아요 클릭 이벤트 처리
        const onFavoriteClickHandler = () => {
            if(!loginUser || !cookies.accessToken || !boardNumber) return;
            putFavoriteRequest(boardNumber, cookies.accessToken).then(putFavoriteResponse);
        }

        // event handler: 좋아요 상자 보기 클릭 이벤트 처리
        const onShowFavoriteClickHandler = () => {
            setShowFavorite(!showFavorite);
        }

        // event handler: 댓글 상자 보기 클릭 이벤트 처리
        const onShowCommentClickHandler = () => {
            setShowComment(!showComment);
        }

        // event handler: 댓글 작성 버튼 클릭 이벤트 처리
        const onCommentSubmitButtonClickHandler = () => {
            if (!comment) return;
        }

        // event handler: 댓글 변경 이벤트 처리
        const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const {value} = event.target;
            setComment(value);
            if(!commentRef.current) return;

            // 댓글 작성 시 줄바꿈 (Enter) 수만큼 textarea 박스 크기가 늘어나도록 함.
            commentRef.current.style.height = 'auto';
            commentRef.current.style.height = `${commentRef.current.scrollHeight}px`
        }

        // effect: 게시물 번호 path variable 이 바뀔 때마다 좋아요 및 댓글 리스트 불러오기
        useEffect(() => {

            if(!boardNumber) return;
            getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
            getCommentListRequest(boardNumber).then(getCommentListResponse);

        }, [boardNumber]);

        // render: 게시물 상세 하단 컴포넌트 렌더링
        return (
            <div id='board-detail-bottom'>
                {/*좋아요 icon / 개수 / 버튼, 댓글 icon / 개수 / 버튼 등*/}
                <div className='board-detail-bottom-button-box'>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button' onClick={onFavoriteClickHandler}>
                            {isFavorite ?
                                <div className='icon favorite-fill-icon'></div> : <div className='icon favorite-light-icon'></div>
                            }
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
                        <div className='icon-button' onClick={onShowFavoriteClickHandler}>
                            {showFavorite ?
                                <div className='icon up-light-icon'></div> : <div className='icon down-light-icon'></div>
                            }
                        </div>
                    </div>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${commentList.length}`}</div>
                        <div className='icon-button' onClick={onShowCommentClickHandler}>
                            {showComment ?
                                <div className='icon up-light-icon'></div> : <div className='icon down-light-icon'></div>
                            }
                        </div>
                    </div>
                </div>

                {/*좋아요 리스트*/}
                {showFavorite &&
                    <div className='board-detail-bottom-favorite-box'>
                        <div className='board-detail-bottom-favorite-container'>
                            <div className='board-detail-bottom-favorite-title'>{'좋아요'} <span
                                className='emphasis'>{favoriteList.length}</span></div>
                            <div className='board-detail-bottom-favorite-contents'>
                                {
                                    favoriteList.map(item =>
                                        <FavoriteItem favoriteListItem={item}/>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                }

                {/*댓글 리스트*/}
                {showComment &&
                    <div className='board-detail-bottom-comment-box'>
                        <div className='board-detail-bottom-comment-container'>
                            <div className='board-detail-bottom-commnet-title'>{'댓글'}<span
                                className='emphasis'>{commentList.length}</span></div>
                            <div className='board-detail-bottom-comment-list-container'>
                                {
                                    commentList.map(item =>
                                        <CommentItem commentListItem={item}/>
                                    )
                                }
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className='board-detail-bottom-comment-pagination-box'>
                            <Pagination/>
                        </div>
                        {/* 로그인 시에만 댓글 입력 가능 */
                            loginUser !== null &&
                            <div className='board-detail-bottom-comment-input-box'>
                                <div className='board-detail-bottom-comment-input-container'>
                                    <textarea ref={commentRef}
                                              className='board-detail-bottom-comment-textarea'
                                              placeholder='댓글을 작성해주세요.'
                                              value={comment}
                                              onChange={onCommentChangeHandler}/>
                                    <div className='board-detail-bottom-comment-button-box'>
                                        <div className={comment === '' ? 'disable-button' : 'black-button'}
                                             onClick={onCommentSubmitButtonClickHandler}>
                                            {'댓글달기'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    };

    // effect: 게시물 번호 path variable 이 바뀔 때마다 게시물 조회수 증가
    let effectFlag = true;
    useEffect(() => {
        if (!boardNumber) return;
        if (effectFlag) {
            effectFlag = false;
            return;
        }

        increaseViewCountRequest(boardNumber).then(increaseViewCountResponse)
    }, [boardNumber]);

    //          render: 게시물 상세 화면 컴포넌트 렌더링          //
    return (
        <div id='board-detail-wrapper'>
            <div className='board-detail-container'>
                <BoardDetailTop/>
                <BoardDetailBottom/>
            </div>
        </div>
    );
}
