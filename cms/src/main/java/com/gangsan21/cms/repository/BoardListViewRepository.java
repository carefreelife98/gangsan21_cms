package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.BoardListViewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Integer> {

    List<BoardListViewEntity> findAllByWriterEmail(String email);

    List<BoardListViewEntity> findByWriterEmailOrderByWriteDateTimeDesc(String email);

    // Top3 가 메서드 명에 있으면, LIMIT 3 와 동일한 역할을 함.
    List<BoardListViewEntity> findTop12ByWriterEmailAndWriteDateTimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDateTimeDesc(String email, LocalDateTime writeDateTime);

    // 검색 리스트 가져오기 (contains == LIKE 문의 역할을 함)
    List<BoardListViewEntity> findByWriterEmailAndTitleContainsOrContentContainsOrderByWriteDateTimeDesc(String email, String title, String content);

    @Query(value =
            "SELECT * " +
            "FROM board_list_view " +
            "WHERE start_dt BETWEEN CURDATE() - INTERVAL 14 DAY AND CURDATE() + INTERVAL 14 DAY " +
            "AND writer_email = ?1 " +
            "ORDER BY start_dt;",
            nativeQuery = true
    )
    List<BoardListViewEntity> find2WeeksBoardListByEmail(String email);

    // 해결되지 않은 업무를 전부 조회.
    List<BoardListViewEntity> findByWriterEmailAndIsSucceedFalse(String email);
}
