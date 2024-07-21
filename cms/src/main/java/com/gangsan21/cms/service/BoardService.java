package com.gangsan21.cms.service;


import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import org.springframework.http.ResponseEntity;

public interface BoardService {

    // @Param: Board 내용과 작성자의 Email 주소.
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

}
