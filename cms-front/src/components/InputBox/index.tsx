import './style.css';
import {Dispatch, SetStateAction, forwardRef, ChangeEvent, KeyboardEvent} from "react";

//          interface: Properties          //
interface Props {
    label: string;
    type: 'text' | 'password' // 입력 타입 지정
    placeholder: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    error: boolean; // 입력 에러 확인

    // Not Required
    icon?: string;

    // 외부에서 함수 생성하여 넘길 예정
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
//          component: Input Box 컴포넌트, Ref: 엔터 누를 시 다음 컴포넌트로 넘겨줌          //
const InputBox = forwardRef<HTMLInputElement, Props>((props, ref) => {

    //          state: properties          //
    const {label, type, error, placeholder, value, icon, message} = props
    const {setValue, onButtonClick, onKeyDown} = props;

    //          event handler: Input 값 변경 이벤트 처리 함수          //
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    }

    // 엔터 누를 경우 다음 컴포넌트로 이동하는 핸들러
    //          event handler: 키 이벤트 처리 함수          //
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }

    //          render: Input Box 렌더링          //
    return (
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
                {onButtonClick !== undefined &&
                    <div className='icon-button'>
                        {icon !== undefined && (
                            <div className={`icon ${icon}`}></div>
                        )}
                    </div>
                }
            </div>
            {message !== undefined && <div className='inputbox-message'>{message}</div>}
        </div>
    );
})

export default InputBox;