package com.gangsan21.cms.repository.resultSet;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface GetBoardResultSet {
    Integer getBoardNumber();

    String getTitle();

    String getContent();

    LocalDateTime getWriteDateTime();

    String getWriterEmail();

    String getWriterNickName();

    String getWriterProfileImage();
}
