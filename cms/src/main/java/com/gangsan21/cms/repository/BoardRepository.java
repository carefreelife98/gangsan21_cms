package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.BoardEntity;
import com.gangsan21.cms.repository.resultSet.GetBoardResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    BoardEntity findByBoardNumberAndWriterEmail(Integer boardNumber, String email);
    Boolean existsByBoardNumberAndWriterEmail(Integer boardNumber, String email);

    // native query (JPA)
    @Query(
            value = "SELECT " +
                    "B.board_number    AS boardNumber, " +
                    "B.title           AS title, " +
                    "B.content         AS content, " +
                    "B.is_succeed       AS isSucceed, " +
                    "B.start_dt        AS startDt, " +
                    "B.end_dt          AS endDt, " +
                    "B.write_date_time AS writeDateTime, " +
                    "B.writer_email    AS writerEmail, " +
                    "U.nick_name       AS writerNickName, " +
                    "U.profile_image   AS writerProfileImage " +
                    "FROM board AS B " +
                    "INNER JOIN user AS U " +
                    "ON B.writer_email = U.email " +
                    "WHERE board_number = ?1 " +
                    "AND email = ?2",
            nativeQuery = true
    )
    // WHERE board_number = ?1 : 함수의 첫 번째 매개 변수를 넣겠다.
    GetBoardResultSet getBoard(Integer boardNumber, String email);

}
