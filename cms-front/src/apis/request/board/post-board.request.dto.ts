export default interface PostBoardRequestDto {
    title: string;
    content: string;
    startDt: string;
    endDt: string;
    boardImageList: string[];
    imageWidth: number;
    imageHeight: number;
}