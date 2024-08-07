import {create} from "zustand";

// 전역 상태 사용

interface BoardStore {
    title: string;
    content: string;
    startDt: string;
    endDt: string;
    boardImageFileList: File[];
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setStartDt: (startDt: string) => void;
    setEndDt: (endDt: string) => void;
    setBoardImageFileList: (boardImageFileList: File[]) => void;
    resetBoard: () => void;
}

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    startDt: '',
    endDt: '',
    boardImageFileList: [],
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setStartDt: (startDt) => set(state => ({...state, startDt})),
    setEndDt: (endDt) => set(state => ({...state, endDt})),
    setBoardImageFileList: (boardImageFileList) => set(state => ({...state, boardImageFileList})),
    resetBoard: () => set(state => ({...state, title: '', content: '', startDt: '', endDt: '', boardImageFileList: []})),
}));

export default useBoardStore;