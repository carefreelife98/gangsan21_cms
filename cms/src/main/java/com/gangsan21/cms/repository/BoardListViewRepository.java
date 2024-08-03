package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.BoardListViewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Integer> {

    List<BoardListViewEntity> findByWriterEmailOrderByWriteDateTimeDesc(String email);

    // Top3 가 메서드 명에 있으면, LIMIT 3 와 동일한 역할을 함.
    List<BoardListViewEntity> findTop3ByWriterEmailAndWriteDateTimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDateTimeDesc(String email, LocalDateTime writeDateTime);

}
