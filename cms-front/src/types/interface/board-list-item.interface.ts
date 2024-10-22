export default interface BoardListItem {
    boardNumber: number;
    title: string;
    content: string;
    isSucceed: boolean;
    startDt: string;
    endDt: string;
    imageWidth: number;
    imageHeight: number;
    boardTitleImage: string | null;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    writeDateTime: string;
    writerNickName: string;
    writerProfileImage: string | null;
}