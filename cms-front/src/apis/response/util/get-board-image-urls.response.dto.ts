import ResponseDto from "../response.dto";

export default interface GetBoardImageUrlsResponseDto extends ResponseDto {
    imageUrls?: string[];
}