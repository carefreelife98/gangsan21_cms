import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useBoardStore} from "../../../stores";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../../constants";
import './style.css'
import dayjs from "dayjs";
import TinyMceEditor from "../../Editor";
import ResizeImageButton from "../../File";

interface CalendarMiniBoardProps {
    startDtByCal: string;
    endDtByCal: string;
}

export default function CalendarMiniBoard({ startDtByCal, endDtByCal }: CalendarMiniBoardProps) {
    // alert('start: ' + startDtByCal + ' end: ' + endDtByCal);
    // state: 제목 영역 요소 참조 상태
    const titleRef = useRef<HTMLTextAreaElement | null>(null);

    // state: 본문 영역 요소 참조 상태
    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    // state: 업무 시작일 설정 요소 참조 상태
    const startDtRef = useRef<HTMLInputElement | null>(null);

    // state: 업무 종료일 설정 요소 참조 상태
    const endDtRef = useRef<HTMLInputElement | null>(null);

    // state: 이미지 입력 요소 참조 상태
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // state: 게시물 상태 (전역: 페이지 상단 헤더의 '로그인' 버튼에서 하단 내용의 상태를 알아야 함.)
    const {title, setTitle} = useBoardStore();
    const {content, setContent} = useBoardStore();
    const {startDt, setStartDt} = useBoardStore();
    const {endDt, setEndDt} = useBoardStore();
    const {boardImageFileList, setBoardImageFileList} = useBoardStore();
    const {resetBoard} = useBoardStore();

    // state: 게시물 이미지 미리보기 URL 상태
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();

    // event handler: 제목 변경 이벤트 처리
    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setTitle(value);
        if(!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    // event handler: 업무 시작일 설정 변경 이벤트 처리
    const onStartDtChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setStartDt(dayjs(value).format('YYYY-MM-DDTHH:mm'));
        if(!startDtRef.current) return;
    };

    // event handler: 업무 종료일 설정 변경 이벤트 처리
    const onEndDtChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setEndDt(dayjs(value).format('YYYY-MM-DDTHH:mm'));
        if(!endDtRef.current) return;
    };

    // event handler: 이미지 변경 이벤트 처리
    const onImageChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files || !event.target.files.length) return;

        // 미리보기 용 이미지 추출
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        // 업로드 용 이미지
        const newBoardImageFileList = boardImageFileList.map(item => item);
        newBoardImageFileList.push(file);
        setBoardImageFileList(newBoardImageFileList);

        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';
    };

    // event handler: 이미지 업로드 버튼 클릭 이벤트 처리
    const onImageUploadButtonClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    };

    // event handler: 이미지 제거 버튼 클릭 이벤트 처리
    const onImageCloseButtonClickHandler = (deleteIndex: number) => {
        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';

        const newImageUrls =
            // 삭제 버튼이 눌린 이미지를 제외한 나머지 이미지만 남겨둠.
            imageUrls.filter((url, index) =>
                index != deleteIndex
            );
        setImageUrls(newImageUrls);

        const newBoardImageFileList =
            // 삭제 버튼이 눌린 이미지를 제외한 나머지 이미지만 남겨둠.
            boardImageFileList.filter((file, index) =>
                index !== deleteIndex
            );
        setBoardImageFileList(newBoardImageFileList);
    };

    // effect: 마운트 시 실행할 함수
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken) {
            navigate(MAIN_PATH());
            return;
        }
        resetBoard();
        setStartDt(dayjs(startDtByCal).format('YYYY-MM-DDTHH:mm'))
        setEndDt(dayjs(endDtByCal).subtract(1, 'day').format('YYYY-MM-DDT23:59'))
    }, []);

    //          render: 게시물 작성 화면 렌더정          //
    return (
        <div id='mini-board-write-wrapper'>
            <div className='mini-board-write-container'>
                <h2 className='mini-board-write-main-title'>{'간편 업무 등록'}</h2>
                <div className='divider'></div>
                <div className='mini-board-write-box'>
                    <div className='mini-board-write-date-box'>
                        <div className='mini-board-write-date-desc'>{'업무 시작일: '}</div>
                        <input ref={startDtRef}
                               className='mini-board-write-date'
                               type={'datetime-local'}
                               value={startDt}
                               onChange={onStartDtChangeHandler}
                        />
                        <div className='mini-board-write-date-desc'>{'업무 종료일: '}</div>
                        <input ref={endDtRef}
                               className='mini-board-write-date'
                               type={'datetime-local'}
                               value={endDt}
                               onChange={onEndDtChangeHandler}
                        />
                    </div>
                    <div className='divider'></div>
                    <div className='mini-board-write-title-box'>
                        <textarea ref={titleRef}
                                  className='mini-board-write-title-textarea'
                                  rows={1}
                                  placeholder='제목을 작성해주세요.'
                                  value={title}
                                  onChange={onTitleChangeHandler}
                        />
                    </div>
                    <div className='divider'></div>
                    <div className='mini-board-write-content-box'>
                        <TinyMceEditor content={content}
                                       setContent={setContent}
                        />
                        <div className='mini-board-write-image-upload-box'>
                            {/*이미지만 올릴 수 있도록 지정*/}
                            <input ref={imageInputRef}
                                   type='file'
                                   accept='image/*'
                                   style={{display: 'none'}}
                                   onChange={onImageChangeHandler}
                            />
                            {boardImageFileList.length !== 0 ?
                                <ResizeImageButton />
                                :
                                <></>
                            }
                            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                                <div className='icon image-box-light-icon'></div>
                            </div>
                        </div>
                    </div>
                    <div className='mini-board-write-images-box'>
                        {imageUrls.map((imageUrl, index) =>
                            <div key={index} className='mini-board-write-image-box'>
                                <img className='mini-board-write-image' src={imageUrl}/>
                                <div className='icon-button image-close'
                                     onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};