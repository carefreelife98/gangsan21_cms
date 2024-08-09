package com.gangsan21.cms.dto.response.calendar;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.object.CalendarListItem;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.entity.BoardListViewEntity;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
public class GetCalendarItemListResponseDto extends ResponseDto {

    private List<CalendarListItem> calendarItemList;

    // 같은 종류(타입)의 게시물 리스트 생성.
    public GetCalendarItemListResponseDto(List<List<BoardListViewEntity>> boardListViewEntitiesList, String color, String textColor) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

        // 각 타입 별 게시물 리스트 생성 (캘린더 내 업무 들의 색깔 구분)
        //TODO: 추후 color 및 textColor 을 지금처럼 외부에서 입력 받는 것이 아닌, 여기서 구분하여 집어 넣어야 함.
        List<CalendarListItem> result = new ArrayList<>();
        boardListViewEntitiesList.forEach((boardListViewEntityList -> {
            result.add(new CalendarListItem(boardListViewEntityList, color, textColor));
        }));

        this.calendarItemList = result;
    }

    public static ResponseEntity<GetCalendarItemListResponseDto> success(List<List<BoardListViewEntity>> boardListViewEntityList, String color, String textColor) {
        GetCalendarItemListResponseDto result = new GetCalendarItemListResponseDto(boardListViewEntityList ,color, textColor);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
