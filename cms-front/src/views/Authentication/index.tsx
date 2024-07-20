import './style.css';
import {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import InputBox from "../../components/InputBox";
import {SignInRequestDto} from "../../apis/request/auth";
import {signInRequest} from "../../apis";
import SignInResponseDto from "../../apis/response/auth/sign-in.response.dto";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../constants";
import {useNavigate} from "react-router-dom";

//          component: 인증 화면 컴포넌트          //
export default function Authentication() {

    // state: 화면 상태, 리터럴, 두 가지 상태만 존재하도록 함.
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')

    // state: 쿠키 상태
    const [cookies, setCookie] = useCookies();

    // function: 네비게이트 함수
    const navigator = useNavigate();

    // component: sign in card 컴포넌트
    const SignInCard = () => {

        // state: 이메일 요소 참조 상태
        const emailRef = useRef<HTMLInputElement | null>(null);
        // state: 패스워드 요소 참조 상태
        const passwordRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 상태
        const [email, setEmail] = useState<string>('');
        // state: 패스워드 상태
        const [password, setPassword] = useState<string>('');
        // state: 패스워드 타입 상태 (visible?)
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password')
        // state: 패스워드 버튼 아이콘 상태
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon')
        // state: 에러 상태
        const [error, setError] = useState<boolean>(false);

        // function: sign in response 처리 함수
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                // null 인 경우는 server 동작이 하지 않는 경우.
                alert('네트워크 상태를 확인해 주세요')
                return;
            }
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'SF' || code === 'VF') {
                setError(true);
            }
            if(code !== 'SU') return;

            const {token, expirationTime } = responseBody as SignInResponseDto;
            const now = new Date().getTime();

            // 현재 시간으로부터 1시간 뒤 쿠키 expires.
            const expires = new Date(now + expirationTime * 1000)

            setCookie('accessToken', token, {expires, path: MAIN_PATH()});
            navigator(MAIN_PATH());
        };

        // event handler: 이메일 변경 이벤트 처리
        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target
            setEmail(value);
        };

        // event handler: 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target
            setPassword(value);
        };

        // event handler: 로그인 버튼 클릭 이벤트 처리
        const onSignInButtonClickEventHandler = () => {
            const requestBody: SignInRequestDto = { email, password };
            signInRequest(requestBody).then(signInResponse);

        };

        // event handler: 회원가입 버튼 클릭 이벤트 처리
        const onSignUpLinkClickEventHandler = () => {
            setView('sign-up');
        };

        // event handler: 패스워드 버튼 클릭 이벤트 처리
        const onPasswordButtonClickHandler = () => {
            if (passwordType === 'text') {
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            } else {
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        };

        // event handler: 이메일 인풋 키 다운 이벤트 처리
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordRef.current) return;
            passwordRef.current?.focus();
        };

        // event handler: 이메일 인풋 키 다운 이벤트 처리
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;

            // 패스워드 input 창에서 Enter 입력 시 로그인 버튼 클릭 동작 수행
            onSignInButtonClickEventHandler();
        };

        // render: sign up card 컴포넌트 렌더링
        return (
            <div className='auth-card'>

                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'로그인'}</div>
                        </div>
                        <InputBox ref={emailRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={error}
                                  value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler}/>
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요.'
                                  error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon}
                                  onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
                    </div>
                    <div className='auth-card-bottom'>
                        {error &&
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-mesage'>
                                    {'이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'}
                                </div>
                            </div>
                        }
                        <div className='black-large-full-button' onClick={onSignInButtonClickEventHandler}>{'로그인'}</div>
                        <div className='auth-description-box'>
                            <div className='auth-description'>{'신규 사용자이신가요?  '}</div>
                            <span className='auth-description-link' onClick={onSignUpLinkClickEventHandler}>{'회원가입'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // component: sign up card 컴포넌트
    const SignUpCard = () => {

        // render: sign up card 컴포넌트 렌더링
        return (
            <div className='auth-card'></div>
        );
    };

    //          render: 인증 화면 렌더          //
    return (
        <div id='auth-wrapper'>
            <div className='auth-container'>
                <div className='auth-jumbotron-box'>
                    <div className='auth-jumbotron-contents'>
                        <div className='auth-logo-icon'></div>
                        <div className='auth-jumbotron-text-box'>
                            <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
                            <div className='auth-jumbotron-text'>{'Gang San 21 M&A CMS 입니다.'}</div>
                        </div>
                    </div>
                </div>
                {/*sign in, up 상태 마다 회원 가입 / 로그인 페이지 별 렌더링*/}
                {view === 'sign-in' ? <SignInCard /> : <SignUpCard />}
            </div>
        </div>
    );
}
