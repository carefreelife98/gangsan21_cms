import './style.css';
import {useEffect, useRef, useState} from "react";
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {useParams} from "react-router-dom";

// component: 유저 화면 컴포넌트
export default function User() {

    // state:
    const {userEmail} = useParams();

    // component: 유저 화면 상단 컴포넌트
    const UserTop = () => {

        // state: 이미지 파일 input 참조 상태
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        // state: 마이페이지 여부 상태
        const [isMyPage, setIsMyPage] = useState<boolean>(true);
        // state: 닉네임 변경 여부 상태
        const [isChangeNickName, setIsChangeNickName] = useState<boolean>(false);
        // state: 닉네임 상태
        const [nickName, setNickName] = useState<string>('');
        // state: 닉네임 상태
        const [changeNickName, setChangeNickName] = useState<string>('');
        // state: 프로필 이미지 상태
        const [profileImage, setProfileImage] = useState<string | null>(null);

        // effect: email path variable 변경시 실행할 함수
        useEffect(() => {

            if(!userEmail) return;
            setNickName('carefreelife98');
            setProfileImage('https://picsum.photos/32');

        }, [userEmail]);

        // render: 유저 상단 화면 렌더링
        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ?
                        <div className='user-top-my-profile-image-box'>
                            {profileImage !== null ?
                                <div className='user-top-profile-image' style={{ backgroundImage: `url(${profileImage})`}}></div>
                                :
                                <div className='user-top-my-profile-nothing-box'>
                                    <div className='icon-box-large'>
                                        <div className='icon image-box-white-icon'></div>
                                    </div>
                                </div>
                            }
                            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: "none" }} />
                        </div>
                        :
                        <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage })`}}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ?
                                <>
                                {isChangeNickName ?
                                    <input className='user-top-info-nickname-input' type='text' size={nickName.length + 1} value={changeNickName} />
                                    :
                                    <div className='user-top-info-nickname'>{nickName}</div>
                                }
                                    <div className='icon-button'>
                                        <div className='icon edit-icon'></div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className='user-top-info-nickname'>{nickName}</div>
                                </>
                            }
                        </div>
                        <div className='user-top-info-email'>{'email'}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component: 유저 화면 하단 컴포넌트
    const UserBottom = () => {

        // render: 유저 하단 화면 렌더링
        return (
            <div></div>
        );
    };

    // render: 유저 화면 렌더
    return (
        <>
            <UserTop />
            <UserBottom />
        </>
    );
}
