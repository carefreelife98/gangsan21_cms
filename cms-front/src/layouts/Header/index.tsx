import './style.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH, BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constants";
import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, patchBoardRequest, postBoardRequest} from "../../apis";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PatchBoardResponseDto, PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";

//         component: 헤더 레이아웃          //
export default function Header() {

    // state: cookie 상태
    const [cookies, setCookie] = useCookies();

    // state: 로그인 유저 상태
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

    // state: 로그인 상태
    const [isLogin, setLogin] = useState<boolean>(false);

    // state: path 상태 (현재 위치)
    const { pathname } = useLocation();
    // 각 페이지 별 상태
    const [isAuthPage, setAuthPage] = useState<boolean>(false);
    const [isMainPage, setMainPage] = useState<boolean>(false);
    const [isSearchPage, setSearchPage] = useState<boolean>(false);
    const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
    const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
    const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
    const [isUserPage, setUserPage] = useState<boolean>(false);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // function: 로고 클릭 이벤트 처리 함수
    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    };

    // component: 검색 버튼 컴포넌트
    const SearchButton = () => {
        // state: 검색 버튼 요소 참조 상태
        const searchButtonRef = useRef<HTMLDivElement | null>(null);
        // state: 검색 버튼 상태
        const [status, setStatus] = useState<boolean>(false);
        // state: 검색어 상태
        const [word, setWord] = useState<string>('');
        // state: 검색어 path variable 상태
        const {searchWord} = useParams();

        // event handler: 검색어 키 이벤트 처리 함수
        const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter' || !searchButtonRef.current) return;
            searchButtonRef.current?.click();
        };

        // event handler: 검색어 변경 이벤트 처리 함수
        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value);
        };

        // event handler: 검색 버튼 클릭 이벤트 처리 함수
        const onSearchButtonClickHandler = () => {
            if (!status) {
                setStatus(!status);
                return;
            }
            navigate(SEARCH_PATH(word));
        };

        // effect: 검색어 path variable 변경 될 때마다 실행될 함수
        useEffect(() => {
            if (searchWord) {
                setWord(searchWord);
                setStatus(true);
            }

        }, [searchWord]);

        if (!status)
            //         render: 검색 버튼 컴포넌트 렌더링 (클릭 false 상태)          //
            return (
                <div className='icon-button' onClick={onSearchButtonClickHandler}>
                    <div className='icon search-light-icon'></div>
                </div>
            );

        //         render: 검색 버튼 컴포넌트 렌더링 (클릭 true 상태)          //
        return (
            <div className='header-search-input-box'>
                <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word}
                       onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
                <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
                    <div className='icon search-light-icon'></div>
                </div>

            </div>
        );
    };

    // component: 로그인 또는 마이페이지 버튼 컴포넌트
    const MyPageButton = () => {

        // state: userEmail path variable 상태
        const {userEmail} = useParams();

        // event handler: 마이 페이지 버튼 클릭 이벤트 처리 함수
        const onMyPageButtonClickHandler = () => {
            // 로그인 되어있지 않으면 return,
            // 로그인 상태인 경우 해당 유저의 email 을 받아 마이페이지 이동.
            if (!loginUser) return;
            const {email} = loginUser;
            navigate(USER_PATH(email));
        };

        // event handler: 마이 페이지 버튼 클릭 이벤트 처리 함수
        const onSignOutButtonClickHandler = () => {
            resetLoginUser();

            // 로그아웃 시 토큰도 날림
            setCookie('accessToken', '', {path: MAIN_PATH(), expires: new Date()});
            navigate(MAIN_PATH());
        };

        // event handler: 로그인 버튼 클릭 이벤트 처리 함수
        const onSingInButtonClickHandler = () => {
            navigate(AUTH_PATH());
        };

        // render: 로그아웃 버튼 컴포넌트 렌더링
        if (isLogin && userEmail === loginUser?.email)
            return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>;

        // render: 마이페이지 버튼 컴포넌트 렌더링
        if (isLogin)
            return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>;

        // render: 로그인 버튼 컴포넌트 렌더링
        return <div className='black-button' onClick={onSingInButtonClickHandler}>{'로그인'}</div>;
    }

    // component: 업로드 버튼 컴포넌트
    const UploadButton = () => {

        // state: 게시물 번호 path variable 상태
        const {boardNumber} = useParams();
        // state: 게시물 상태
        const { title, content, startDt, endDt, boardImageFileList, imageWidth, imageHeight, resetBoard } = useBoardStore();

        // function: post board response 처리 함수
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const {code} = responseBody;

            if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수 요소입니다.')
            if (code === 'DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') return;

            resetBoard();
            if (!loginUser) return;
            const {email} = loginUser;
            navigate(USER_PATH(email));
        };

        // function: patch board response 처리 함수
        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const {code} = responseBody;

            if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수 요소입니다.')
            if (code === 'DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') return;

            if(!boardNumber) return;
            navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
        };

        // event handler: 업로드 버튼 클릭 이벤트 처리 함수
        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if(!accessToken) return;

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
            const isBoardWritePage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
            if (isBoardWritePage) {
                const requestBody: PostBoardRequestDto = {
                    title, content, startDt, endDt, boardImageList, imageWidth, imageHeight
                };
                postBoardRequest(requestBody, accessToken).then(postBoardResponse);
            } else {
                if(!boardNumber) return;
                const requestBody: PatchBoardRequestDto = {
                    title, content, startDt, endDt, boardImageList, imageWidth, imageHeight
                };
                patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
            }

        };

        if (title && content) {
            // render: 업로드 버튼 컴포넌트 렌더링
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        }

        // render: 업로드 불가 버튼 컴포넌트 렌더링
        return <div className='disable-button' >{'업로드'}</div>;

    };

    // effect: path 가 변경 될 때마다 실행될 함수
    useEffect(() => {
        const isAuthPage = pathname.startsWith(AUTH_PATH());
        setAuthPage(isAuthPage);

        const isMainPage = pathname === MAIN_PATH();
        setMainPage(isMainPage);

        const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
        setSearchPage(isSearchPage);

        const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
        setBoardDetailPage(isBoardDetailPage);

        const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        setBoardWritePage(isBoardWritePage);

        const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
        setBoardUpdatePage(isBoardUpdatePage);

        const isUserPage = pathname.startsWith(USER_PATH(''));
        setUserPage(isUserPage);

    }, [pathname])

    // effect: login user 가 변경될 때마다 실행될 함수
    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser])

    //         render: 헤더 레이아웃 렌더링          //
    return (
        <div id='header'>
            <div className='header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box'>
                        <div className='icon logo-light-icon'></div>
                    </div>
                    <div className='header-logo'>{'Gang San 21 M&A CMS'}</div>
                </div>
                <div className='header-right-box'>
                    {/* 각 페이지 내 버튼 컴포넌트 노출 조건 */}
                    {
                        (isAuthPage || isMainPage || isSearchPage || isBoardDetailPage)
                        && <SearchButton />
                    }
                    {
                        (isMainPage || isSearchPage || isBoardDetailPage || isUserPage )
                        && <MyPageButton />
                    }
                    {
                        (isBoardWritePage || isBoardUpdatePage)
                        && <UploadButton />
                    }
                </div>
            </div>
        </div>
    );
};
