package com.gangsan21.cms.dto.response.calendar;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.object.CalendarListItem;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.entity.BoardListViewEntity;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
public class GetCalendarItemListResponseDto extends ResponseDto {

    private CalendarListItem calendarItemList;

    // 같은 종류(타입)의 게시물 리스트 생성.
    public GetCalendarItemListResponseDto(List<BoardListViewEntity> boardListViewEntityList, String color, String textColor) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.calendarItemList = new CalendarListItem(boardListViewEntityList, color, textColor);
    }

    public static ResponseEntity<GetCalendarItemListResponseDto> success(List<BoardListViewEntity> boardListViewEntityList, String color, String textColor) {
        GetCalendarItemListResponseDto result = new GetCalendarItemListResponseDto(boardListViewEntityList ,color, textColor);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
