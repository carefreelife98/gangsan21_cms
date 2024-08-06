package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.response.board.GetRelationListResponseDto;
import com.gangsan21.cms.dto.response.search.GetPopularListResponseDto;
import org.springframework.http.ResponseEntity;

public interface SearchService {

    ResponseEntity<? super GetPopularListResponseDto> getPopularList();

    ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord);

}
