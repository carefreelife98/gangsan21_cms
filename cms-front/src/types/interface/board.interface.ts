export default interface Board {
    boardNumber: number;
    title: string;
    content: string;
    isSucceed: boolean;
    startDt: string;
    endDt: string;
    boardImageList: string[];
    imageWidth: number;
    imageHeight: number;
    writeDateTime: string;
    writerEmail: string;
    writerNickName: string;
    writerProfileImage: string | null;
}

