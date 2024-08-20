import './style.css';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {useNavigate, useParams} from "react-router-dom";
import {BoardListItem} from "../../types/interface";
import BoardItem from "../../components/BoardItem";
import {BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH} from "../../constants";
import {useLoginUserStore} from "../../stores";
import {
    fileUploadRequest,
    getUserBoardListRequest,
    getUserRequest,
    patchNickNameRequest,
    patchProfileImageRequest
} from "../../apis";
import {GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto} from "../../apis/response/user";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "../../apis/request/user";
import {usePagination} from "../../hooks";
import {GetUserBoardListResponseDto} from "../../apis/response/board";
import Pagination from "../../components/Pagination";

// component: 유저 화면 컴포넌트
export default function User() {

    // state: userEmail path variable 상태
    const {userEmail} = useParams();
    // state: 마이페이지 여부 상태
    const [isMyPage, setIsMyPage] = useState<boolean>(true);
    // state: 로그인 유저 상태
    const {loginUser} = useLoginUserStore();
    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();

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
        // state: 이메일 상태
        const [email, setEmail] = useState<string>('');

        // function: getUserResponse 처리 함수
        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'VF') alert('인증에 실패하였습니다. 다시 로그인 해주세요.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.')
            if (code === 'DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') {
                navigate(MAIN_PATH())
                return;
            }

            const {email, nickName, profileImage} = responseBody as GetUserResponseDto;
            setNickName(nickName);
            setProfileImage(profileImage);
            setEmail(email)
            const isMyPage = email === loginUser?.email;
            setIsMyPage(isMyPage);
        };

        // function: patchProfileImageResponse 처리 함수
        const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === 'VF') alert('잘못된 접근입니다.');
            if (code === 'AF') alert('인증에 실패하였습니다. 다시 로그인 해주세요.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code ==='DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') return;

            if (!userEmail) return;
            getUserRequest(cookies.accessToken, userEmail).then(getUserResponse);
        };

        // fileUploadResponse 처리 함수
        const fileUploadResponse = (profileImage: string | null) => {
            if (!profileImage) return;
            if(!cookies.accessToken) return;

            const requestBody: PatchProfileImageRequestDto = {profileImage};
            patchProfileImageRequest(cookies.accessToken, requestBody).then(patchProfileImageResponse);
        };

        // patchNickNameResponse 처리 함수
        const patchNickNameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;

            if (code === 'VF') alert('닉네임은 필수입니다.');
            if (code === 'AF') alert('인증에 실패하였습니다. 다시 로그인 해주세요.');
            if (code === 'DN') alert('중복되는 닉네임입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code ==='DBE') alert('데이터 베이스 오류입니다.');
            if (code !== 'SU') return;

            if (!userEmail) return;
            getUserRequest(cookies.accessToken, userEmail).then(getUserResponse);
            setIsChangeNickName(false);
        };

        // event handler: profile 박스 클릭 이벤트 처리
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!imageInputRef.current) return;
            imageInputRef.current.click();
        }

        // event handler: nickname 수정 버튼 클릭 이벤트 처리
        const onNickNameEditButtonClickHandler = () => {
            if (!isChangeNickName) {
                setChangeNickName(nickName);
                setIsChangeNickName(!isChangeNickName);
                return;
            }
            if (!cookies.accessToken) return;
            const requestBody: PatchNicknameRequestDto = {
                nickName: changeNickName,
            };
            patchNickNameRequest(cookies.accessToken, requestBody).then(patchNickNameResponse);
        }

        // event handler: profile 이미지 변경 이벤트 처리
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files.length) return;

            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);

            fileUploadRequest(data).then(fileUploadResponse);
        }

        // event handler: 닉네임 변경 이벤트 처리
        const onNickNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setChangeNickName(value);
        }

        // effect: email path variable 변경시 실행할 함수
        useEffect(() => {
            if(!userEmail) return;
            getUserRequest(cookies.accessToken, userEmail).then(getUserResponse);

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
                        <div className='user-top-info-email'>{email}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component: 유저 화면 하단 컴포넌트
    const UserBottom = () => {

        // state: 페이지네이션 관련 상태
        const {
            currentPage, setCurrentPage,
            currentSection, setCurrentSection,
            viewList, viewPageList,
            totalSection, setTotalList
        } = usePagination<BoardListItem>(5);

        // state: 게시물 개수 상태
        const [count, setCount] = useState<number>(2);

        // function: getUserBoardListResponse 처리 함수
        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                navigate(MAIN_PATH())
                return;
            }
            if (code === 'DBE') alert('데이터 베이스 오류입니다.');
            if (code !== 'SU') return;

            const {userBoardList} = responseBody as GetUserBoardListResponseDto;
            setTotalList(userBoardList);
            setCount(userBoardList.length);
        };

        // event handler: 사이드 카드 클릭 이벤트 처리
        const onSideCardClickHandler = () => {
            if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if (loginUser) navigate(USER_PATH(loginUser.email));
        }

        // effect: userEmail path variable 이 변경될 때마다 실행할 함수.
        useEffect(() => {
            if (!userEmail) return;
            if (!cookies.accessToken) return;

            getUserBoardListRequest(cookies.accessToken, userEmail).then(getUserBoardListResponse);
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
                                {viewList.map((boardListItem, index) => <BoardItem key={index} boardListItem={boardListItem} />)}
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
                    <div className='user-bottom-pagination-box'>
                        {count !== 0 &&
                            <Pagination currentPage={currentPage}
                                        currentSection={currentSection}
                                        setCurrentPage={setCurrentPage}
                                        setCurrentSection={setCurrentSection}
                                        viewPageList={viewPageList}
                                        totalSection={totalSection} />
                        }
                    </div>
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
