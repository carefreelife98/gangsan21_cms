import React, {useEffect, useState} from "react";
import RadioGroup from '../RadioGroup';

const ALARM_OPTION_LIST_ENUM = {
    '알람 없음': 'N',
    '10분': '10m',
    '30분': '30m',
    '1시간': '1H',
    '3시간': '3H',
    '6시간': '6H',
    '12시간': '12H',
    '1일': '1D',
    '3일': '3D',
    '일주일': '1W',
    '보름': '2W',
    '한 달': '1M'
};

export default function Setting() {

    const [alarmPeriod, setAlarmPeriod] = useState<string | null>('');

    // RadioGroup 내에서 라디오 버튼 선택 값 처리 함수
    const handleRadioChange = (value: string) => {
        console.log('Selected value:', value);
    };

    useEffect(() => {
        //TODO: 알람 주기 조회 API 호출 및 값 초기화
        setAlarmPeriod(null);
    }, []);

    return (
        <div id="setting-wrapper">
            <div className="setting-container">
                <div className="setting-radio-group-box">
                    <RadioGroup
                        init={alarmPeriod}
                        title="업무 알림 설정"
                        options={ALARM_OPTION_LIST_ENUM}
                        name="alarm-setting"
                        onChange={handleRadioChange}
                    />
                </div>
            </div>
        </div>
    );
}
