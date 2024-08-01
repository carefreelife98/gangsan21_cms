import ResponseDto from "../response.dto";
import {FavoriteListItem} from "../../../types/interface";

export default interface GetFavoriteListResponseDto extends ResponseDto {
    favoriteList: FavoriteListItem[];
}