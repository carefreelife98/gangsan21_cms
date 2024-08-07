package com.gangsan21.cms.dto.object;

import com.gangsan21.cms.entity.BoardListViewEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardListItem {
    private Integer boardNumber;
    private String title;
    private String content;
    private LocalDateTime startDt;
    private LocalDateTime endDt;
    private String boardTitleImage;
    private Integer favoriteCount;
    private Integer commentCount;
    private Integer viewCount;
    private LocalDateTime writeDateTime;
    private String writerNickName;
    private String writerProfileImage;

    public BoardListItem(BoardListViewEntity boardListViewEntity) {
        this.boardNumber = boardListViewEntity.getBoardNumber();
        this.title = boardListViewEntity.getTitle();
        this.content = boardListViewEntity.getContent();
        this.startDt = boardListViewEntity.getStartDt();
        this.endDt = boardListViewEntity.getEndDt();
        this.boardTitleImage = boardListViewEntity.getTitleImage();
        this.favoriteCount = boardListViewEntity.getFavoriteCount();
        this.commentCount = boardListViewEntity.getCommentCount();
        this.viewCount = boardListViewEntity.getViewCount();
        this.writeDateTime = boardListViewEntity.getWriteDateTime();
        this.writerNickName = boardListViewEntity.getWriterNickName();
        this.writerProfileImage = boardListViewEntity.getWriterProfileImage();
    }

    public static List<BoardListItem> getList(List<BoardListViewEntity> boardListViewEntityList) {
        List<BoardListItem> list = new ArrayList<>();
        boardListViewEntityList.forEach(boardListViewEntity -> {
            BoardListItem boardListItem = new BoardListItem(boardListViewEntity);
            list.add(boardListItem);
        });
        return list;
    }
}
