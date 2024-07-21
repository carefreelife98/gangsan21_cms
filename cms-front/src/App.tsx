import React, {useEffect, useState} from 'react';
import './App.css';
import Footer from "./layouts/Footer";
import {Route, Routes} from "react-router-dom";
import Main from "./views/Main";
import Authentication from "./views/Authentication";
import Search from "./views/Search";
import UserP from "./views/User";
import BoardDetail from "./views/Board/Detail";
import BoardWrite from "./views/Board/Write";
import BoardUpdate from "./views/Board/Update";
import Container from "./layouts/Container";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH, BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "./constants";
import {useCookies} from "react-cookie";
import {useLoginUserStore} from "./stores";
import {getSignInUserRequest} from "./apis";
import {GetSignInUserResponseDto} from "./apis/response/user";
import {ResponseDto} from "./apis/response";
import {User} from "./types/interface";


//          component: Application 컴포넌트          //
function App() {

    // state: 로그인 유저 전역 상태
    const { setLoginUser, resetLoginUser } = useLoginUserStore();

    // state: cookie 상태
    const [cookies, setCookie] = useCookies();

    // function: get sign in user response 처리 함수
    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if (code === 'AF' || code === 'NU' || code === 'DBE') {
            resetLoginUser();
            return;
        }
        const loginUser: User = {...responseBody as GetSignInUserResponseDto};
        setLoginUser(loginUser);
    }

    // effect: accessToken cookie 값이 변경될 때 마다 실행될 함수.
    useEffect(() => {
        // 쿠키에 accessToken 이 존재하지 않는 경우
        if (!cookies.accessToken) {
            // 로그인 user 값을 null 로 변경
            resetLoginUser();
            return;
        }
        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse)
    }, [cookies.accessToken]);

    //          render: Application 컴포넌트 렌더링          //
    // description: 메인 화면: '/' - Main //
    // description: 로그인 + 회원 가입 화면: '/auth' - Authentication //
    // description: 검색 화면: '/search/:searchWord' - Search //
    // description: 게시물 수정하기: '/user/:userEmail' - User //

    // description: 게시물 상세 보기: '/board/detail/:boardNumber' - BoardDetail //
    // description: 게시물 작성하기: '/board/write' - BoardWrite //
    // description: 게시물 수정하기: '/board/update/:boardNumber' - BoardUpdate //

    return (
        <Routes>
            <Route element={<Container />}>
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route path={AUTH_PATH()} element={<Authentication />} />
                <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
                <Route path={USER_PATH(':userEmail')} element={<UserP />} />
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
                    <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
                    <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
                </Route>
            </Route>
            <Route path='*' element={<h1>404 Not Found: URL 경로가 잘못 되었습니다.</h1>} />
        </Routes>
    );
}

export default App;
