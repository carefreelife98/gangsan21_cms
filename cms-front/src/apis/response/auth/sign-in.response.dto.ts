import ResponseDto from "../response.dto";
import * as stream from "stream";

export default interface SignInResponseDto extends ResponseDto {
    token: string,
    expirationTime: number;
}