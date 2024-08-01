// custom hook 함수는 함수 이름이 "use" 로 시작하면 된다. (간단)
import {useEffect, useState} from "react";

// 다양한 곳에서 공용으로 사용하므로 여러 타입의 상태가 사용될 수 있어야 함. -> 이를 위해 상태 타입을 usePagination() 이 호출될 때에 결정하도록 하기 위해 "제네릭 <T>" 사용 (T: Type)
const usePagination = <T>(countPerPage: number) => {

    // state: 전체 객체 리스트 상태
    const [totalList, setTotalList] = useState<T[]>([]);
    // state: 보여줄 객체 리스트 상태
    const [viewList, setViewList] = useState<T[]>([]);
    // state: 현재 페이지 번호 상태
    const [currentPage, setCurrentPage] = useState<number>(1);
    // state: 전체 페이지 번호 상태
    const [totalPage, setTotalPage] = useState<number>(1);
    // state: 전체 페이지 번호 리스트 상태
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    // state: 보여줄 페이지 번호 리스트 상태
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    // state: 현재 섹션 상태
    const [currentSection, setCurrentSection] = useState<number>(1);
    // state: 전체 섹션 상태
    const [totalSection, setTotalSection] = useState<number>(1);

    // function: 보여줄 객체 리스트 추출 함수
    const setView = () => {
        // 시작 인덱스: 3 * (n - 1)
        const FIRST_INDEX = countPerPage * (currentPage - 1);

        // 종료 인덱스: 이론은 3 * n - 1 이지만, slice 함수가 마지막 인덱스를 포함하지 않으므로 자동으로 -1 됨 (== 3 * n)
        // 페이지 개수 * 페이지 당 객체 개수 가 전체 객체 개수보다
        // 크면 -> 전체 객체 개수 반환
        // 작으면 딱 들어맞는 개수임. 그대로 반환.
        const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length
        const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
        setViewList(viewList);
    }

    // function: 보여줄 페이지 리스트 추출 함수
    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentPage - 1);
        const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    }

    // Effect: total list 가 변경될 때마다 실행할 작업
    useEffect(() => {
        // 전체 데이터를 외부에서 정한 페이지당 객체 개수로 나눈뒤 올림? (+1 해도 될 것 같은데..)
        const totalPage = Math.ceil(totalList.length / countPerPage);

        const totalPageList: number[]  = [];
        for(let page = 1; page <= totalPage; page++)
            totalPageList.push(page)
        setTotalPageList(totalPageList)

        // 한 페이지 당 10 개 보여줌.
        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        setTotalSection(totalSection)

        setCurrentPage(1);
        setCurrentSection(1);

        // 보여줄 객체 추출
        setView();
        // 보여줄 섹션 추출
        setViewPage();
    }, [totalList]);

    // Effect: current page 가 변경될 때마다 실행할 작업.
    useEffect(setView, [currentPage]);

    // Effect: current section 가 변경될 때마다 실행할 작업.
    useEffect(setViewPage, [currentPage]);

    return {
        currentPage, // 현재 페이지
        setCurrentPage, // 현재 페이지 변경

        currentSection, // 현재 섹션
        setCurrentSection, // 현재 섹션 변경

        viewList, // 현재 보여줄 리스트
        viewPageList, // 현재 보여줄 페이지 리스트

        totalSection, // 전체 섹션 정보 (현재 섹션이 마지막 섹션 인경우 다음 섹션 이동 버튼 (>) disabled 시키는 등의 작업 위함.
        setTotalList // 최종 결과 데이터 가공
    }
};

export default usePagination;