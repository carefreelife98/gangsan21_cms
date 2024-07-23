package com.gangsan21.cms.dto.response.board;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import lombok.Getter;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class PostCommentResponseDto extends ResponseDto {


    private PostCommentResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<PostCommentResponseDto> success() {
        PostCommentResponseDto result = new PostCommentResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXTSTED_BOARD, ResponseMessage.NOT_EXTSTED_BOARD);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
