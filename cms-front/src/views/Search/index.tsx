import './style.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {BoardListItem} from "../../types/interface";
import {latestBoardListMock} from "../../mocks";
import BoardItem from "../../components/BoardItem";
import {SEARCH_PATH} from "../../constants";
import Pagination from "../../components/Pagination";

// component: 검색 화면 컴포넌트
export default function Search() {

    // state: searchWord path variable 상태
    const {searchWord} = useParams();
    // state: 검색 게시물 개수 상태
    const [count, setCount] = useState<number>(0);
    // state: 검색 결과 게시물 리스트 상태 (임시)
    const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);
    // state: 관련 검색어 리스트 상태
    const [relationList, setRelationList] = useState<string[]>([]);

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // event handler: 연관 검색어 클릭 이벤트 처리
    const onRelationWordClickHandler =(word: string) => {
        navigate(SEARCH_PATH(word));
    }

    // effect: searchWord가 변경될 때마다 실행될 함수
    useEffect(() => {
        setSearchBoardList(latestBoardListMock)
        // setRelationList(['안녕', '잘가'])
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
                            {searchBoardList.map((boardListItem, index) => <BoardItem key={index} boardListItem={boardListItem}/>)}
                        </div>
                    }
                    <div className='search-relation-box'>
                        <div className='search-relation-card'>
                            <div className='search-relation-card-container'>
                                <div className='search-relation-card-title'>{'관련 검색어'}</div>
                                {relationList.length === 0 ?
                                    <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div>
                                    :
                                    <div className='search-relation-card-contents'>
                                        {relationList.map((word, index) => <div key={index} className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='search-pagination-box'>
                    {/*{count !== 0 && /*<Pagination currentPage={} currentSection={} setCurrentPage={} setCurrentSection={} viewPageList={} totalSection={}*!/*/}
                </div>
            </div>
        </div>
    );
}
