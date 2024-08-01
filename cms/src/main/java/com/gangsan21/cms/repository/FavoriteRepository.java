package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.FavoriteEntity;
import com.gangsan21.cms.entity.primaryKey.FavoritePk;
import com.gangsan21.cms.repository.resultSet.GetFavoriteListResultSet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {
    // FavoritePk 라는 클래스로 복합키 정의.
    // FavoriteEntity 클래스에 @IdClass 어노테이션을 통해 지정되어 있음.

    FavoriteEntity findByBoardNumberAndUserEmail(Integer boardNumber, String userEmail);

    @Query(
            value =
                    "SELECT " +
                            "U.email         AS email, " +
                            "U.nick_name     AS nickName, " +
                            "U.profile_image AS profileImage " +
                            "FROM favorite AS F " +
                            "INNER JOIN user AS U " +
                            "ON F.user_email = U.email " +
                            "WHERE F.board_number = ?1",
            nativeQuery = true
    )
    List<GetFavoriteListResultSet> getFavoriteList(Integer boardNumber);

    @Transactional
    void deleteByBoardNumber(Integer boardNumber);
}
