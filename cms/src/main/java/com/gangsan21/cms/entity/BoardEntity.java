package com.gangsan21.cms.entity;

import com.gangsan21.cms.dto.request.board.PatchBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board")
@Table(name = "board")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private LocalDateTime startDt;

    @Column
    private LocalDateTime endDt;

    private Boolean isSucceed;

    @Column(columnDefinition = "INTEGER")
    private Integer imageWidth;

    @Column(columnDefinition = "INTEGER")
    private Integer imageHeight;

    private LocalDateTime writeDateTime;
    private Integer favoriteCount;
    private Integer commentCount;
    private Integer viewCount;
    private String writerEmail;

    public BoardEntity(PostBoardRequestDto dto, String email) {

        LocalDateTime writeDateTime = LocalDateTime.now();

        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.startDt = dto.getStartDt();
        this.endDt = dto.getEndDt();
        this.imageHeight = dto.getImageHeight();
        this.imageWidth = dto.getImageWidth();
        this.writeDateTime = writeDateTime;
        this.favoriteCount = 0;
        this.commentCount = 0;
        this.viewCount = 0;
        this.writerEmail = email;
        this.isSucceed = false;
    }

    public void patchBoard(PatchBoardRequestDto dto) {
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.startDt = dto.getStartDt();
        this.endDt = dto.getEndDt();
        this.imageHeight = dto.getImageHeight();
        this.imageWidth = dto.getImageWidth();
    }

    public void succeedStatusToggle() {
        this.isSucceed = !this.isSucceed;
    }

    public void increaseViewCount() {
         this.viewCount++;
    }

    public void increaseCommentCount() {
        this.commentCount++;
    }

    public void increaseFavoriteCount() {
        this.favoriteCount++;
    }

    public void decreaseFavoriteCount() {
        this.favoriteCount--;
    }
}
