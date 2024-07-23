package com.gangsan21.cms.repository;

import com.gangsan21.cms.entity.CommentEntity;
import com.gangsan21.cms.repository.resultSet.GetCommentListResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    @Query(
            value = "SELECT " +
                        "U.email         AS email, " +
                        "U.nick_name     AS nickName, " +
                        "U.profile_image AS profileImage, " +
                        "C.write_date_time AS writeDateTime, " +
                        "C.content AS content " +
                    "FROM comment AS C " +
                    "INNER JOIN user AS U " +
                    "ON C.user_email = U.email " +
                    "WHERE C.board_number = ?1 " +
                    "AND U.email = ?2 " +
                    "ORDER BY write_date_time DESC ",
            nativeQuery = true
    )
    List<GetCommentListResultSet> getCommentListByBoardNumberAndEmail(Integer boardNumber, String email);

}
