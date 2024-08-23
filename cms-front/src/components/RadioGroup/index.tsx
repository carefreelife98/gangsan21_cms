import React, {useState, useEffect, ChangeEvent} from 'react';
import './style.css';
import {Setting} from "../../types/interface";

type RadioGroupProps = {
    initSetting: Setting | null; // 초기 상태의 세팅 값
    title: string; // RadioGroup의 제목
    options: { [key: string]: string }; // 라디오 버튼의 key-value 객체 (JSON 형태)
    name: string; // 라디오 버튼의 그룹 이름
    onChange: (event: ChangeEvent<HTMLInputElement>) => void; // 선택된 값이 변경될 때 호출되는 함수
};

export default function RadioGroup({ initSetting, title, options, name, onChange }: RadioGroupProps) {
    const [selectedValue, setSelectedValue] = useState<string>(initSetting?.alarmPeriod || Object.keys(options)[0]);

    useEffect(() => {
        if (initSetting && options[initSetting.alarmPeriod]) {
            setSelectedValue(initSetting.alarmPeriod);
        }
    }, [initSetting, options]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedValue(value);
        onChange(event);
    };

    return (
        <div id='radio-group-wrapper'>
            <div className='radio-group-title'>{title}</div>
            <div className='divider'></div>
            <div className="radio-group">
                {Object.entries(options).map(([key, label], index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name={name}
                            value={label}
                            checked={selectedValue === label}
                            onChange={handleChange}
                        />
                        {key}
                    </label>
                ))}
            </div>
        </div>
    );
}
