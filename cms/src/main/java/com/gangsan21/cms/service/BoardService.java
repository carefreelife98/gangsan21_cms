package com.gangsan21.cms.service;


import com.gangsan21.cms.dto.request.board.PatchBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostCommentRequestDto;
import com.gangsan21.cms.dto.response.board.*;
import org.springframework.http.ResponseEntity;

public interface BoardService {

    // @Param: Board 내용과 작성자의 Email 주소.

    ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber, String email);
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);
    ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, Integer boardNumber, String email);
    ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer boardNumber, String email);

    ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList(String email);
    ResponseEntity<? super GetTop3BoardListResponseDto> getTop3BoardList(String email);

    ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber, String email);
    ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber, String email);

    ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber, String email);
    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email);

    ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer boardNumber, String email);
}
