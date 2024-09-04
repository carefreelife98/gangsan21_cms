package com.gangsan21.cms.dto.response.util;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
public class GetBoardImageUrlsResponseDto extends ResponseDto {

    private List<String> imageUrls;

    private GetBoardImageUrlsResponseDto(List<String> urls) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.imageUrls = urls;
    }

    public static ResponseEntity<GetBoardImageUrlsResponseDto> success(List<String> imageUrls) {
        GetBoardImageUrlsResponseDto result = new GetBoardImageUrlsResponseDto(imageUrls);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistsBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXITSTED_BOARD, ResponseMessage.NOT_EXISTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
