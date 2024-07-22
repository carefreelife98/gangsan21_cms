package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.FavoriteEntity;
import com.gangsan21.cms.entity.primaryKey.FavoritePk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {
    // FavoritePk 라는 클래스로 복합키 정의.
    // FavoriteEntity 클래스에 @IdClass 어노테이션을 통해 지정되어 있음.

    FavoriteEntity findByBoardNumberAndUserEmail(Integer boardNumber, String userEmail);
}
