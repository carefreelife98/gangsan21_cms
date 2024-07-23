package com.gangsan21.cms.repository.resultSet;

import java.time.LocalDateTime;

public interface GetCommentListResultSet {
    String getNickName();

    String getProfileImage();

    LocalDateTime getWriteDateTime();

    String getContent();
}
