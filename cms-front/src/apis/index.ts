import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import {ResponseDto} from "./response";

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in;`
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

// 동기 함수로 처리 (작업 완료 시까지 대기하도록)
export const signInRequest = async (requestBody: SignInRequestDto) => {

    // await 을 걸지 않으면 API 호출 및 반환이 되기 전에 다음 동작으로 넘어가게 됨.
    return await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
};

// 동기 함수로 처리 (작업 완료 시까지 대기하도록)
export const signUpRequest = async (requestBody: SignUpRequestDto) => {

};