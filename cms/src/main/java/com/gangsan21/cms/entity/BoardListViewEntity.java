package com.gangsan21.cms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Immutable // view 이므로 수정 불가.
@Entity(name = "board_list_view")
@Table(name = "board_list_view")
public class BoardListViewEntity {

    // board
    @Id
    private Integer boardNumber;

    private String title;
    private String content;
    private Boolean isSucceed;
    private LocalDateTime startDt;
    private LocalDateTime endDt;
    private LocalDateTime writeDateTime;
    private Integer favoriteCount;
    private Integer commentCount;
    private Integer viewCount;
    private String writerEmail;

    //
    private String titleImage;
    private String writerNickName;
    private String writerProfileImage;
}
