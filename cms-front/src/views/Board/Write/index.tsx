import './style.css';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useBoardStore} from "../../../stores";

//          component: 게시물 작성 화면 컴포넌트          //
export default function BoardWrite() {
    // state: 제목 영역 요소 참조 상태
    const titleRef = useRef<HTMLTextAreaElement | null>(null);

    // state: 본문 영역 요소 참조 상태
    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    // state: 이미지 입력 요소 참조 상태
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // state: 게시물 상태 (전역: 페이지 상단 헤더의 '로그인' 버튼에서 하단 내용의 상태를 알아야 함.)
    const {title, setTitle} = useBoardStore();
    const {content, setContent} = useBoardStore();
    const {boardImageFileList, setBoardImageFileList} = useBoardStore();
    const {resetBoard} = useBoardStore();

    // event handler: 제목 변경 이벤트 처리
    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setTitle(value);
        if(!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    // event handler: 내용 변경 이벤트 처리
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContent(value);
        if(!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
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

    // state: 게시물 이미지 미리보기 URL 상태
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // effect: 마운트 시 실행할 함수
    useEffect(() => {
        resetBoard();
    }, []);

    //          render: 게시물 작성 화면 렌더정          //
    return (
        <div id='board-write-wrapper'>
            <div className='board-write-container'>
                <div className='board-write-box'>
                    <div className='board-write-title-box'>
                        <textarea ref={titleRef}
                                  className='board-write-title-textarea'
                                  rows={1}
                                  placeholder='제목을 작성해주세요.'
                                  value={title}
                                  onChange={onTitleChangeHandler}
                        />
                    </div>
                    <div className='divider'></div>
                    <div className='board-write-content-box'>
                        <textarea ref={contentRef}
                                  className='board-write-content-textarea'
                                  placeholder='본문을 작성해주세요.'
                                  value={content}
                                  onChange={onContentChangeHandler}
                        />
                        <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                            <div className='icon image-box-light-icon'></div>
                        </div>

                        {/*이미지만 올릴 수 있도록 지정*/}
                        <input ref={imageInputRef}
                               type='file'
                               accept='image/*'
                               style={{display: 'none'}}
                               onChange={onImageChangeHandler}
                        />
                    </div>
                    <div className='board-write-images-box'>
                        {imageUrls.map((imageUrl, index) =>
                            <div className='board-write-image-box'>
                                <img className='board-write-image'
                                     src={imageUrl}/>
                                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
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
