package com.gangsan21.cms.dto.object;

import com.gangsan21.cms.repository.resultSet.GetCommentListResultSet;
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
public class CommentListItem {
    private String nickName;
    private String profileImage;
    private LocalDateTime writeDateTime;
    private String content;

    public CommentListItem(GetCommentListResultSet resultSet) {
        this.nickName = resultSet.getNickName();
        this.profileImage = resultSet.getProfileImage();
        this.writeDateTime = resultSet.getWriteDateTime();
        this.content = resultSet.getContent();
    }

    public static List<CommentListItem> copyList(List<GetCommentListResultSet> resultSetList) {

        List<CommentListItem> list = new ArrayList<>();
        resultSetList.forEach(resultSet -> {
            list.add(new CommentListItem(resultSet));
        });

        return list;
    }
}
