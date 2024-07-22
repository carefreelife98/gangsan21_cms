package com.gangsan21.cms.dto.response.board;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.entity.ImageEntity;
import com.gangsan21.cms.repository.resultSet.GetBoardResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
public class GetBoardResponseDto extends ResponseDto {

    private Integer boardNumber;
    private String title;
    private String content;
    private List<String> boardImageList;
    private LocalDateTime writeDateTime;
    private String writerEmail;
    private String writerNickName;
    private String writerProfileImage;

    private GetBoardResponseDto(GetBoardResultSet resultSet, List<ImageEntity> imageEntityList) {

        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

        List<String> boardImageList = new ArrayList<>();
        imageEntityList.forEach(imageEntity ->
                boardImageList.add(imageEntity.getImage())
        );

        this.boardNumber = resultSet.getBoardNumber();
        this.title = resultSet.getTitle();
        this.content = resultSet.getContent();
        this.boardImageList = boardImageList;
        this.writeDateTime = resultSet.getWriteDateTime();
        this.writerEmail = resultSet.getWriterEmail();
        this.writerNickName = resultSet.getWriterNickName();
        this.writerProfileImage = resultSet.getWriterProfileImage();
    }

    public static ResponseEntity<GetBoardResponseDto> success(GetBoardResultSet resultSet, List<ImageEntity> imageEntityList) {
        GetBoardResponseDto result = new GetBoardResponseDto(resultSet, imageEntityList);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXTSTED_BOARD, ResponseMessage.NOT_EXTSTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
