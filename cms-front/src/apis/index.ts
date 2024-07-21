import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import {ResponseDto} from "./response";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import {SignUpResponseDto} from "./response/auth";
import error = Simulate.error;
import {GetSignInUserResponseDto} from "./response/user";

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers: {Authorization: `Bearer ${accessToken}`} };
};

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
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody
        });
    return result;
};

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};