import './style.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {BoardListItem} from "../../types/interface";
import BoardItem from "../../components/BoardItem";
import {SEARCH_PATH} from "../../constants";
import Pagination from "../../components/Pagination";
import {getRelationListRequest, getSearchBoardListRequest} from "../../apis";
import {GetSearchBoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {usePagination} from "../../hooks";
import {useCookies} from "react-cookie";
import {GetRelationListResponseDto} from "../../apis/response/search";

// component: 검색 화면 컴포넌트
export default function Search() {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();
    // state: searchWord path variable 상태
    const {searchWord} = useParams();
    // state: 페이지네이션 관련 상태
    const {
        currentPage, setCurrentPage,
        currentSection, setCurrentSection,
        viewList, viewPageList,
        totalSection, setTotalList
    } = usePagination<BoardListItem>(5);
    // state: 이전 검색어 상태
    const [preSearchWord, setPreSearchWord] = useState<string | null>(null);
    // state: 검색 게시물 개수 상태
    const [count, setCount] = useState<number>(0);
    // state: 관련 검색어 리스트 상태
    const [relationWordList, setRelationWordList] = useState<string[]>([]);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // function: getSearchBoardListResponse 처리 함수
    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.')
        if(code !== 'SU') return;

        if (!searchWord) return;
        const {searchList} = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length);
        setPreSearchWord(searchWord);
    };

    // function: getSearchBoardListResponse 처리 함수
    const getRelationListResponse = (responseBody: GetRelationListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.')
        if(code !== 'SU') return;

        if (!searchWord) return;
        const {relativeWordList} = responseBody as GetRelationListResponseDto;
        setRelationWordList(relativeWordList)
    };

    // event handler: 연관 검색어 클릭 이벤트 처리
    const onRelationWordClickHandler =(word: string) => {
        navigate(SEARCH_PATH(word));
    }

    // effect: searchWord가 변경될 때마다 실행될 함수
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken) return;
        if(!searchWord) return;

        // preSearchWord 사용 시 이전 검색어의 검색 결과도 함께 나타남. 따라서 임시 삭제.
        getSearchBoardListRequest(cookies.accessToken, searchWord, '').then(getSearchBoardListResponse);
        getRelationListRequest(searchWord).then(getRelationListResponse);
    }, [searchWord]);

    // render: 검색 화면 렌더링
    if(!searchWord) return (<></>)
    return (
        <div id='search-wrapper'>
            <div className='search-container'>
                <div className='search-title-box'>
                    <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{' 에 대한 검색결과 입니다.'}</div>
                    <div className='search-count'>총 {count} 개</div>
                </div>
                <div className='search-contents-box'>
                    {count === 0 ?
                        <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div>
                        :
                        <div className='search-contents'>
                            {viewList.map((boardListItem, index) => <BoardItem key={index} boardListItem={boardListItem}/>)}
                        </div>
                    }
                    <div className='search-relation-box'>
                        <div className='search-relation-card'>
                            <div className='search-relation-card-container'>
                                <div className='search-relation-card-title'>{'관련 검색어'}</div>
                                {relationWordList.length === 0 ?
                                    <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div>
                                    :
                                    <div className='search-relation-card-contents'>
                                        {relationWordList.map((word, index) => <div key={index} className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='search-pagination-box'>
                    {count !== 0 &&
                        <Pagination currentPage={currentPage}
                                    currentSection={currentSection}
                                    setCurrentPage={setCurrentPage}
                                    setCurrentSection={setCurrentSection}
                                    viewPageList={viewPageList}
                                    totalSection={totalSection} />
                    }
                </div>
            </div>
        </div>
    );
}
