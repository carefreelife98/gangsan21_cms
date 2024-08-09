package com.gangsan21.cms.dto.response.board;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.object.BoardListItem;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.entity.BoardListViewEntity;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
public class GetLatestBoardListResponseDto extends ResponseDto {

    private List<BoardListItem> latestList;

    private GetLatestBoardListResponseDto(List<BoardListViewEntity> boardEntityList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.latestList = BoardListItem.getList(boardEntityList);
    }

    public static ResponseEntity<GetLatestBoardListResponseDto> success(List<BoardListViewEntity> boardListViewEntityList) {
        GetLatestBoardListResponseDto result = new GetLatestBoardListResponseDto(boardListViewEntityList);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
