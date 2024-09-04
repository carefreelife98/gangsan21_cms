package com.gangsan21.cms.dto.object;

import com.gangsan21.cms.entity.BoardListViewEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class CalendarListItem {

    List<CalendarItem> events;
    String color;
    String textColor;

    // BoardListItem.getList() 를 통해 모든 BoardListViewEntity (전체 게시물) 를 파라미터로 받아 가공한다.
    //TODO: color, text color 을 특정 케이스로 DB 컬럼등에 추가하여 구분 후 파라미터로 넘겨 사용.
    public CalendarListItem(List<BoardListViewEntity> boardListViewEntityList, String color, String textColor) {
        // 게시물 리스트를 받아 각각의 게시물을 CalendarItem 으로 가공한 후 List 로 저장.
        this.events = boardListViewEntityList.stream().map(CalendarItem::new).collect(Collectors.toList());
        this.color = color;
        this.textColor = textColor;
    }

    @Getter
    public static class CalendarItem {
        String id;
        String title;
        String content;
        Boolean isSucceed;
        Integer imageWidth;
        Integer imageHeight;
        LocalDateTime start;
        LocalDateTime end;
        String url;
        Boolean editable;

        public CalendarItem(BoardListViewEntity boardListViewEntity) {
            this.id = boardListViewEntity.getBoardNumber().toString();
            this.title = boardListViewEntity.getTitle();
            this.content = boardListViewEntity.getContent();
            this.start = boardListViewEntity.getStartDt();
            this.isSucceed = boardListViewEntity.getIsSucceed();
            this.imageWidth = boardListViewEntity.getImageWidth();
            this.imageHeight = boardListViewEntity.getImageHeight();
            this.end = boardListViewEntity.getEndDt();
            this.url = getUrl(boardListViewEntity.getBoardNumber());
            this.editable = true; // true: 캘린더 상에서 마우스 드래그 / 클릭 등을 통한 이벤트 수정 가능.
        }

        private String getUrl(Integer boardNumber) {
            return "/board/detail/" + boardNumber;
        }
    }
}