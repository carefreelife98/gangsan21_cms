import ResponseDto from '../response.dto';
import {BoardListItem} from "../../../types/interface";

export default interface GetTop3BoardListResponseDto extends ResponseDto {
    top3List: BoardListItem[];
}