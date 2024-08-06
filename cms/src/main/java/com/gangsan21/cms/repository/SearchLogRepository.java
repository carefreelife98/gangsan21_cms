package com.gangsan21.cms.repository;

import com.gangsan21.cms.dto.response.board.GetRelationListResponseDto;
import com.gangsan21.cms.entity.SearchLogEntity;
import com.gangsan21.cms.repository.resultSet.GetPopularListResultSet;
import com.gangsan21.cms.repository.resultSet.GetRelationListResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Integer> {

    @Query(value =
            "SELECT search_word as searchWord, count(search_word) AS count " +
                    "FROM search_log " +
                    "WHERE relation IS FALSE " +
                    "GROUP BY search_word " +
                    "ORDER BY count DESC " +
                    "LIMIT 15",
            nativeQuery = true
    )
    List<GetPopularListResultSet> getPopularList();

    @Query(value =
            "SELECT relation_word AS searchWord, count(relation_word) AS count " +
            "FROM search_log " +
            "WHERE search_word = ?1 " +
            "AND relation_word IS NOT NULL " +
            "GROUP BY relation_word " +
            "ORDER BY count desc " +
            "LIMIT 15",
            nativeQuery = true
    )
    List<GetRelationListResultSet> getRelationList(String searchWord);
}
