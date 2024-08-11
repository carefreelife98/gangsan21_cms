import ResponseDto from '../response.dto';
import {BoardListItem} from '../../../types/interface';

export default interface GetSearchBoardListResponseDto extends ResponseDto {
    searchList: BoardListItem[];
}