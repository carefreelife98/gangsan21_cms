import ResponseDto from '../response.dto';
import {BoardListItem} from "../../../types/interface";

export default interface GetUserBoardListResponseDto extends ResponseDto {
    userBoardList: BoardListItem[];
}