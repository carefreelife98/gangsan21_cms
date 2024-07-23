package com.gangsan21.cms.service;


import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.board.GetBoardResponseDto;
import com.gangsan21.cms.dto.response.board.GetFavoriteListResponseDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import com.gangsan21.cms.dto.response.board.PutFavoriteResponseDto;
import org.springframework.http.ResponseEntity;

public interface BoardService {

    ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber, String email);
    ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber, String email);

    // @Param: Board 내용과 작성자의 Email 주소.
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email);
}
