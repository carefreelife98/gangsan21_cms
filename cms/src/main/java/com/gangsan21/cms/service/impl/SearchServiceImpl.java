package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.search.GetPopularListResponseDto;
import com.gangsan21.cms.repository.SearchLogRepository;
import com.gangsan21.cms.repository.resultSet.GetPopularListResultSet;
import com.gangsan21.cms.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {

        List<GetPopularListResultSet> resultSetList;

        try {

            resultSetList = searchLogRepository.getPopularList();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetPopularListResponseDto.success(resultSetList);
    }
}
