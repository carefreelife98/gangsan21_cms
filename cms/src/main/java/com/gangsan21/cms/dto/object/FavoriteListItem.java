package com.gangsan21.cms.dto.object;

import com.gangsan21.cms.repository.resultSet.GetFavoriteListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteListItem {
    private String email;
    private String nickName;
    private String profileImage;

    public FavoriteListItem(GetFavoriteListResultSet resultSet) {
        this.email = resultSet.getEmail();
        this.nickName = resultSet.getNickName();
        this.profileImage = resultSet.getProfileImage();
    }

    public static List<FavoriteListItem> copyList(List<GetFavoriteListResultSet> resultSetList) {
        List<FavoriteListItem> list = new ArrayList<>();

        resultSetList.forEach(resultSet -> {
            FavoriteListItem item = new FavoriteListItem(resultSet);
            list.add(item);
        });

        return list;
    }
}
