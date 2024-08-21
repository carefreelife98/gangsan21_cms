import React, { useState, useEffect } from 'react';
import './style.css';

type RadioGroupProps = {
    init: string | null; // 초기 선택된 라디오 버튼의 key
    title: string; // RadioGroup의 제목
    options: { [key: string]: string }; // 라디오 버튼의 key-value 객체 (JSON 형태)
    name: string; // 라디오 버튼의 그룹 이름
    onChange: (value: string) => void; // 선택된 값이 변경될 때 호출되는 함수
};

export default function RadioGroup({ init, title, options, name, onChange }: RadioGroupProps) {
    const [selectedValue, setSelectedValue] = useState<string>(init || Object.keys(options)[0]);

    useEffect(() => {
        if (init && options[init]) {
            setSelectedValue(init);
        }
    }, [init, options]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedValue(value);
        onChange(value);
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
