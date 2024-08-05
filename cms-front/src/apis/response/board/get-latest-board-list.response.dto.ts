import ResponseDto from '../response.dto';
import {BoardListItem} from '../../../types/interface';

export default interface GetLatestBoardListResponseDto extends ResponseDto {
    latestList: BoardListItem[];
}