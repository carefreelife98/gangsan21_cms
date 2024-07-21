package com.gangsan21.cms.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardListItem {
    private Integer boardNumber;
    private String title;
    private String content;
    private String boardTitleImage;
    private Integer favoriteCount;
    private Integer commentCount;
    private Integer viewCount;
    private LocalDateTime writeDateTime;
    private String writerNickName;
    private String writerProfileImage;
}
