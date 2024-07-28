export default interface Board {
    boardNumber: number;
    title: string;
    content: string;
    boardImageList: string[];
    writeDateTime: Date;
    writerEmail: string;
    writerNickName: string;
    writerProfileImage: string | null;
}

