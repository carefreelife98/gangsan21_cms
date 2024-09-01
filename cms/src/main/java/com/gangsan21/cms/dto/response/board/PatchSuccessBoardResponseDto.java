package com.gangsan21.cms.dto.response.board;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class PatchSuccessBoardResponseDto extends ResponseDto {

    private PatchSuccessBoardResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<PatchSuccessBoardResponseDto> success() {
        PatchSuccessBoardResponseDto result = new PatchSuccessBoardResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXITSTED_BOARD, ResponseMessage.NOT_EXTSTED_BOARD);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
}
