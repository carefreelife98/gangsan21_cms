import {create} from "zustand";
import {str} from "ajv";

// 전역 상태 사용

interface BoardStore {
    title: string;
    content: string;
    startDt: string;
    endDt: string;
    boardImageFileList: File[];
    imageWidth: number;
    imageHeight: number;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setStartDt: (startDt: string) => void;
    setEndDt: (endDt: string) => void;
    setBoardImageFileList: (boardImageFileList: File[]) => void;
    setImageWidth: (imageWidth: number) => void;
    setImageHeight: (imageHeight: number) => void;
    resetBoard: () => void;
}

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    startDt: '',
    endDt: '',
    boardImageFileList: [],
    imageWidth: 0,
    imageHeight: 0,
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setStartDt: (startDt) => set(state => ({...state, startDt})),
    setEndDt: (endDt) => set(state => ({...state, endDt})),
    setBoardImageFileList: (boardImageFileList) => set(state => ({...state, boardImageFileList})),
    setImageWidth: (imageWidth) => set(state => ({...state, imageWidth})),
    setImageHeight: (imageHeight) => set(state => ({...state, imageHeight})),
    resetBoard: () => set(state => ({...state, title: '', content: '', startDt: '', endDt: '', boardImageFileList: []})),
}));

export default useBoardStore;