import './style.css';
import Top3Item from "../../components/Top3Item";
import {useEffect, useState} from "react";
import {BoardListItem} from "../../types/interface";
import {latestBoardListMock, top3BoardListMock} from "../../mocks";
import BoardItem from "../../components/BoardItem";
import Pagination from "../../components/Pagination";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, SEARCH_PATH} from "../../constants";
import {getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest} from "../../apis";
import {GetLatestBoardListResponseDto, GetTop3BoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";
import {usePagination} from "../../hooks";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import {GetPopularListResponseDto} from "../../apis/response/search";

//          component: 메인 화면 컴포넌트          //
export default function Main() {

    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // component: 메인화면 상단 컴포넌트
    const MainTop = () => {

        // state: 주간 Top3 게시물 상태
        const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

        // function: getTop3BoardListResponse 처리 함수
        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터 베이스 오류입니다.')
            if (code !== 'SU') return;

            const {top3List} = responseBody as GetTop3BoardListResponseDto;
            setTop3BoardList(top3List);
        };

        // effect: 첫 마운트 시 실행될 함수
        useEffect(() => {
            // 로그인 되어 있지 않은 경우 로그인 페이지로 강제 이동.
            if (!cookies.accessToken) navigate(AUTH_PATH());
            getTop3BoardListRequest(cookies.accessToken).then(getTop3BoardListResponse)
        }, []);

        //          render: 메인 상단 화면 렌더링          //
        const [currentIndex, setCurrentIndex] = useState(0);
        const itemsPerPage = 3;

        const handlePrevClick = () => {
            setCurrentIndex((prevIndex) => {
                const newIndex = prevIndex - itemsPerPage;
                return newIndex < 0 ? Math.max(0, top3BoardList.length - itemsPerPage) : newIndex;
            });
        };

        const handleNextClick = () => {
            setCurrentIndex((prevIndex) => {
                const newIndex = prevIndex + itemsPerPage;
                return newIndex >= top3BoardList.length ? 0 : newIndex;
            });
        };

        return (
            <>
                <div id='main-top-wrapper'>
                    <div className='main-top-container'>
                        <div className='main-top-title'>{'Gang San 21 M&A CMS 에 오신 것을\n환영합니다.'}</div>
                        <div className='main-top-contents-box'>
                            <div className='main-top-contents-title'>{'주간 TOP 12 업무'}</div>
                            <div className='carousel-box'>
                                <div className='carousel'>
                                    <button className='carousel-button left' onClick={handlePrevClick}>{"<"}</button>
                                    <div className='carousel-inner' style={{ transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)` }}>
                                        {top3BoardList.map((top3ListItem, index) => (
                                            <div className='carousel-item' key={index} style={{ flex: `0 0 ${100 / itemsPerPage}%` }}>
                                                <div className='main-top-contents-rank'>{index + 1}</div>
                                                <Top3Item top3ListItem={top3ListItem} />
                                            </div>
                                        ))}
                                    </div>
                                    <button className='carousel-button right' onClick={handleNextClick}>{">"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
    // component: 메인화면 하단 컴포넌트
    const MainBottom = () => {

        // function: 네비게이트 함수
        const navigate = useNavigate();

        // state: 페이지네이션 관련 상태
        const {
            currentPage, setCurrentPage,
            currentSection, setCurrentSection,
            viewList, viewPageList,
            totalSection, setTotalList
        } = usePagination<BoardListItem>(5);

        // state: 인기 검색어 리스트 상태 (임시)
        const [popularWordList, setPopularWordList] = useState<string[]>([]);

        // function: getLatestBoardListResponse 처리 함수
        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'DBE') alert('데이터 베이스 오류입니다.')
            if(code !== 'SU') return;

            const {latestList} = responseBody as GetLatestBoardListResponseDto;
            setTotalList(latestList);
        };

        //function: getPopularListResponse 처리 함수
        const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'DBE') alert('데이터 베이스 오류입니다.')
            if(code !== 'SU') return;

            const {popularWordList} = responseBody as GetPopularListResponseDto;
            setPopularWordList(popularWordList);
        };

        // event handler: 인기 검색어 클릭 이벤트 처리
        const onPopularWordClickHandler = (word: string) => {
            navigate(SEARCH_PATH(word))
        }

        // effect: 첫 마운트 시 실행될 함수
        useEffect(() => {
            getLatestBoardListRequest().then(getLatestBoardListResponse)
            getPopularListRequest().then(getPopularListResponse)
        }, []);

        //          render: 메인 하단 화면 렌더링          //
        return (
            <div id='main-bottom-wrapper'>
                <div className='main-bottom-container'>
                    <div className='main-bottom-title'>{'최신 게시물'}</div>
                    <div className='main-bottom-contents-box'>
                        <div className='main-bottom-current-contents'>
                            {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
                        </div>
                        <div className='main-bottom-popular-box'>
                            <div className='main-bottom-popular-card'>
                                <div className='main-bottom-popular-card-container'>
                                    <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                                    <div className='main-bottom-popular-card-contents'>
                                        {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='main-bottom-pagination-box'>
                        <Pagination currentPage={currentPage}
                                    currentSection={currentSection}
                                    setCurrentPage={setCurrentPage}
                                    setCurrentSection={setCurrentSection}
                                    viewPageList={viewPageList}
                                    totalSection={totalSection} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <MainTop />
            <MainBottom />
        </>
    );
}
