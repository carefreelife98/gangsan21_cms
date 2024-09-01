export default interface Board {
    boardNumber: number;
    title: string;
    content: string;
    isSucceed: boolean;
    startDt: string;
    endDt: string;
    boardImageList: string[];
    writeDateTime: string;
    writerEmail: string;
    writerNickName: string;
    writerProfileImage: string | null;
}

