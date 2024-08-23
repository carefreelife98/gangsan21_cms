import React, {ChangeEvent, useEffect, useState} from "react";
import './style.css';
import RadioGroup from '../../components/RadioGroup';
import {getSettingRequest, patchSettingRequest} from "../../apis";
import {useCookies} from "react-cookie";
import {GetSettingResponseDto} from "../../apis/response/setting";
import {ResponseDto} from "../../apis/response";
import {MAIN_PATH} from "../../constants";
import {Setting} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import {useLoginUserStore} from "../../stores";
import {PatchSettingRequestDto} from "../../apis/request/setting";
import PatchSettingResponseDto from "../../apis/response/setting/patch-setting.response.dto";


const ALARM_OPTION_LIST_ENUM = {
    '알람 없음': 'N', // 알람 없음의 경우 "N" 로 설정
    '10분': '0 */10 * * * *', // 매 10분마다 (초, 분, 시, 일, 월, 요일)
    '30분': '0 */30 * * * *', // 매 30분마다 (초, 분, 시, 일, 월, 요일)
    '1시간': '0 0 * * * *', // 매 1시간마다 (정각)
    '3시간': '0 0 */3 * * *', // 매 3시간마다 (정각)
    '6시간': '0 0 */6 * * *', // 매 6시간마다 (정각)
    '12시간': '0 0 */12 * * *', // 매 12시간마다 (정각)
    '1일': '0 0 0 * * *', // 매일 0시 (자정)
    '3일': '0 0 0 */3 * *', // 매 3일마다 0시
    '일주일': '0 0 0 * * 0', // 매주 일요일 0시
    '보름': '0 0 0 1,15 * *', // 매달 1일과 15일 0시
    '한 달': '0 0 0 1 * *' // 매달 1일 0시
};

export default function UserSetting() {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();
    // state: 로그인 유저 상태
    const { loginUser } = useLoginUserStore();
    // state: 세팅 상태
    const [setting, setSetting] = useState<Setting | null>(null);
    // state: 로딩 상태
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // function: 네비게이트 함수
    const navigate = useNavigate();
    // function: 특정 value 값으로 key 추출
    function getKeyByValue(value: string | undefined) {
        if (value === undefined) return;
        return Object.entries(ALARM_OPTION_LIST_ENUM).find(([key, val]) => val === value)?.[0];
    }

    // function: getSettingResponse 처리 함수
    const getSettingResponse = (responseBody: GetSettingResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if(code === 'NU') alert('존재하지 않는 유저입니다.');
        if(code === 'AF') alert('인증에 실패했습니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') {
            navigate(MAIN_PATH());
            return;
        }

        const setting: Setting = {...responseBody as GetSettingResponseDto}
        if (setting.userEmail !== loginUser?.email) {
            alert('인증 과정에서 오류가 발생하였습니다. 다시 로그인 해주세요.');
            navigate(MAIN_PATH());
            return;
        }
        setSetting(setting);
    };

    // function: patchSettingResponse 처리 함수
    const patchSettingResponse = (responseBody: PatchSettingResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;
        if(code === 'NU') alert('존재하지 않는 유저입니다.');
        if(code === 'AF') alert('인증에 실패했습니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') {
            navigate(MAIN_PATH());
            return;
        }
        getSettingRequest(cookies.accessToken)
            .then(getSettingResponse)
            .then(() => {
                if (code === 'SU') alert('알림 설정이 완료되었습니다.')
            });
    };

    // RadioGroup 내에서 라디오 버튼 변경 처리 함수
    const onRadioButtonChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!cookies.accessToken) return;

        const {value} = event.target;
        if(!value) return;

        const requestBody: PatchSettingRequestDto = {
            cron: value,
        };
        patchSettingRequest(requestBody, cookies.accessToken).then(patchSettingResponse)
    };

    useEffect(() => {
        //TODO: 알람 주기 조회 API 호출 및 값 초기화
        setIsLoading(true);
        getSettingRequest(cookies.accessToken).then(getSettingResponse).then(() => setIsLoading(false));
    }, []);

    return (
        <div id="setting-wrapper">
            <div className="setting-container">
                <div className="setting-radio-group-box">
                    {isLoading ?
                        <div className='loading'>{'로딩 중...'}</div>
                        :
                        <RadioGroup
                            initSetting={setting}
                            title="업무 알림 설정"
                            options={ALARM_OPTION_LIST_ENUM}
                            name="alarm-setting"
                            onChange={onRadioButtonChangeHandler}
                        />
                    }
                </div>
            </div>
        </div>
    );
}
