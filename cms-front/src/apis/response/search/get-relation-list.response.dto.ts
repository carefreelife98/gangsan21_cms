import ResponseDto from '../response.dto';

export default interface GetRelationListResponseDto extends ResponseDto {
    relativeWordList: string[];
}