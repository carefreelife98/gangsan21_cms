package com.gangsan21.cms.dto.response.board;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.repository.resultSet.GetRelationListResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
public class GetRelationListResponseDto extends ResponseDto {

    private List<String> relativeWordList;

    private GetRelationListResponseDto(List<GetRelationListResultSet> resultSetList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        List<String> relativeWordList = new ArrayList<>();

        resultSetList.forEach(resultSet -> {
            String relativeWord = resultSet.getSearchWord();
            relativeWordList.add(relativeWord);
        });

        this.relativeWordList = relativeWordList;
    }

    public static ResponseEntity<GetRelationListResponseDto> success(List<GetRelationListResultSet> resultSetList) {
        GetRelationListResponseDto result = new GetRelationListResponseDto(resultSetList);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
