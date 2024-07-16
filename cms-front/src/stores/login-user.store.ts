import {User} from "../types/interface";
import {create} from "zustand";

// 전역적으로 사용하는 상태 변수 설정 (로그인 관련)
interface LoginUserStore {
    loginUser: User | null;
    setLoginUser: (loginUser: User) => void;
    resetLoginUser: () => void;
}

/*
* loginUser: 전역 상태 값
* setLoginUser: 전역 상태 변수 set 함수
* resetLoginUser: 전역 상태 변수 set 함수
*
* - 초기에 null 상태이다가, set 함수를 통해 로그인 유저를 받아와서 set 하는 동작.
* - reset 함수는 아무것도 받아오지 않고 현재 user 를 null 로 변경하여 로그아웃 동작.
* */
const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser: null,
    setLoginUser: loginUser => set(state => ({...state, loginUser})),
    resetLoginUser: () => set(state => ({ ...state, loginUser: null}))
}));

export default useLoginUserStore;