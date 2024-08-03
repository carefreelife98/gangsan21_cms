package com.gangsan21.cms.dto.response.search;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.repository.resultSet.GetPopularListResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
public class GetPopularListResponseDto extends ResponseDto {

    private List<String> popularWordList;

    private GetPopularListResponseDto(List<GetPopularListResultSet> resultSetList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

        List<String> tempPopularWordList = new ArrayList<>();
        resultSetList.forEach(resultSet -> {
            tempPopularWordList.add(resultSet.getSearchWord());
        });

        this.popularWordList = tempPopularWordList;
    }

    public static ResponseEntity<GetPopularListResponseDto> success(List<GetPopularListResultSet> resultSetList) {
        GetPopularListResponseDto result = new GetPopularListResponseDto(resultSetList);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
