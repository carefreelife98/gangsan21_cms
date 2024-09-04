package com.gangsan21.cms.repository.resultSet;

import java.time.LocalDateTime;

public interface GetBoardResultSet {
    Integer getBoardNumber();

    String getTitle();

    String getContent();

    Boolean getIsSucceed();

    LocalDateTime getStartDt();

    LocalDateTime getEndDt();

    Integer getImageWidth();

    Integer getImageHeight();

    LocalDateTime getWriteDateTime();

    String getWriterEmail();

    String getWriterNickName();

    String getWriterProfileImage();
}
