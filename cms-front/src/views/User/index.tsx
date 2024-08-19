import './style.css';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {useNavigate, useParams} from "react-router-dom";
import {BoardListItem} from "../../types/interface";
import {latestBoardListMock} from "../../mocks";
import BoardItem from "../../components/BoardItem";
import {BOARD_PATH, BOARD_WRITE_PATH, USER_PATH} from "../../constants";
import {el} from "@fullcalendar/core/internal-common";
import {useLoginUserStore} from "../../stores";

// component: 유저 화면 컴포넌트
export default function User() {

    // state: userEmail path variable 상태
    const {userEmail} = useParams();
    // state: 마이페이지 여부 상태
    const [isMyPage, setIsMyPage] = useState<boolean>(true);
    // state: 로그인 유저 상태
    const {loginUser} = useLoginUserStore();

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // component: 유저 화면 상단 컴포넌트
    const UserTop = () => {

        // state: 이미지 파일 input 참조 상태
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        // state: 닉네임 변경 여부 상태
        const [isChangeNickName, setIsChangeNickName] = useState<boolean>(false);
        // state: 닉네임 상태
        const [nickName, setNickName] = useState<string>('');
        // state: 닉네임 변경 상태
        const [changeNickName, setChangeNickName] = useState<string>('');
        // state: 프로필 이미지 상태
        const [profileImage, setProfileImage] = useState<string | null>(null);

        // event handler: profile 박스 클릭 이벤트 처리
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!imageInputRef.current) return;
            imageInputRef.current.click();
        }

        // event handler: nickname 수정 버튼 클릭 이벤트 처리
        const onNickNameEditButtonClickHandler = () => {
            setChangeNickName(nickName);
            setIsChangeNickName(!isChangeNickName);
        }

        // event handler: profile 이미지 변경 이벤트 처리
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files.length) return;

            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);
        }

        // event handler: 닉네임 변경 이벤트 처리
        const onNickNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setChangeNickName(value);
        }

        // effect: email path variable 변경시 실행할 함수
        useEffect(() => {

            if(!userEmail) return;
            setNickName('carefreelife98');
            setProfileImage('https://picsum.photos/32');

        }, [userEmail]);

        // render: 유저 상단 화면 렌더링
        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ?
                        <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                            {profileImage !== null ?
                                <div className='user-top-profile-image' style={{ backgroundImage: `url(${profileImage})`}}></div>
                                :
                                <div className='icon-box-large'>
                                    <div className='icon image-box-white-icon'></div>
                                </div>
                            }
                            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: "none" }} onChange={onProfileImageChangeHandler}/>
                        </div>
                        :
                        <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage })`}}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ?
                                <>
                                    {isChangeNickName ?
                                        <input className='user-top-info-nickname-input' type='text' size={nickName.length + 2} value={changeNickName} onChange={onNickNameChangeHandler} />
                                        :
                                        <div className='user-top-info-nickname'>{nickName}</div>
                                    }
                                    <div className='icon-button' onClick={onNickNameEditButtonClickHandler}>
                                        <div className='icon edit-icon' />
                                    </div>
                                </>
                                :
                                <>
                                    <div className='user-top-info-nickname'>{nickName}</div>
                                </>
                            }
                        </div>
                        <div className='user-top-info-email'>{'email'}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component: 유저 화면 하단 컴포넌트
    const UserBottom = () => {

        // state: 게시물 개수 상태
        const [count, setCount] = useState<number>(2);
        // state: 게시물 리스트 상태 (임시)
        const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);

        // event handler: 사이드 카드 클릭 이벤트 처리
        const onSideCardClickHandler = () => {
            if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if (loginUser) navigate(USER_PATH(loginUser.email));
        }

        // effect: userEmail path variable 이 변경될 때마다 실행할 함수.
        useEffect(() => {
            setUserBoardList(latestBoardListMock)
        }, [userEmail]);

        // render: 유저 하단 화면 렌더링
        return (
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    {isMyPage ?
                        <div className='user-bottom-title'>{'내 게시물 '}<span className='emphasis'>{count}</span></div>
                        :
                        <div className='user-bottom-title'>{'게시물 '}</div>
                    }
                    <div className='user-bottom-contents-box'>
                        {count === 0 ?
                            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div>
                            :
                            <div className='user-bottom-contents'>
                                {userBoardList.map((boardListItem, index) => <BoardItem key={index} boardListItem={boardListItem} />)}
                            </div>
                        }
                        <div className='user-bottom-side-box'>
                            <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                                <div className='user-bottom-side-container'>
                                    {isMyPage ?
                                        <>
                                            <div className='icon-box'>
                                                <div className='icon edit-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text'>{'업무 추가하기'}</div>
                                        </>
                                        :
                                        <>
                                            <div className='user-bottom-side-text'>{'내 업무로 가기'}</div>
                                            <div className='icon-box'>
                                                <div className='icon arrow-right-icon'></div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-bottom-pagination-box'></div>
                </div>
            </div>
        );
    };

    // render: 유저 화면 렌더
    return (
        <>
            <UserTop />
            <UserBottom />
        </>
    );
}
