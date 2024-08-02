package com.gangsan21.cms.controller.board;

import com.gangsan21.cms.dto.object.FavoriteListItem;
import com.gangsan21.cms.dto.request.board.PatchBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostCommentRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.*;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/{boardNumber}")
    public ResponseEntity<? super GetBoardResponseDto> getBoard(
            @PathVariable Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication))
            return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        // 로그인 한 유저의 게시물만 가져온다.
        ResponseEntity<? super GetBoardResponseDto> response = boardService.getBoard(boardNumber, principal.getEmail());
        return response;
    }

    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(
            @RequestBody @Valid PostBoardRequestDto requestBody,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        // TODO: @AuthenticationPrincipal 동작하지 않아 임시 방편으로 아래와 같이 SecurityContextHolder 에서 직접 꺼내 사용.
        //  추후 @AuthenticationPrincipal 사용으로 변경 필요
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication))
            return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        ResponseEntity<? super PostBoardResponseDto> response = boardService.postBoard(requestBody, principal.getEmail());

        return response;
    }

    @PatchMapping("/{boardNumber}")
    public ResponseEntity<? super PatchBoardResponseDto> patchBoard(
            @RequestBody @Valid PatchBoardRequestDto requestBody,
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication))
            return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        ResponseEntity<? super PatchBoardResponseDto> response = boardService.patchBoard(requestBody, boardNumber, principal.getEmail());
        return response;
    }

    @DeleteMapping("/{boardNumber}")
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super DeleteBoardResponseDto> response = boardService.deleteBoard(boardNumber, principal.getEmail());
        return response;
    }

    @GetMapping("/{boardNumber}/favorite-list")
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) {
            return ResponseDto.validationFailed();
        }

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        ResponseEntity<? super GetFavoriteListResponseDto> response = boardService.getFavoriteList(boardNumber, principal.getEmail());

        return response;
    }

    @PutMapping("/{boardNumber}/favorite")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication))
            return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super PutFavoriteResponseDto> response = boardService.putFavorite(boardNumber, principal.getEmail());
        return response;
    }

    @GetMapping("/{boardNumber}/comment-list")
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        ResponseEntity<? super GetCommentListResponseDto> response = boardService.getCommentList(boardNumber, principal.getEmail());

        return response;

    }

    @PostMapping("/{boardNumber}/comment")
    public ResponseEntity<? super PostCommentResponseDto> putComment(
            @RequestBody @Valid PostCommentRequestDto requestBody,
            @PathVariable("boardNumber") Integer boardNumber,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super PostCommentResponseDto> response = boardService.postComment(requestBody, boardNumber, principal.getEmail());

        return response;
    }

    @PatchMapping("/{boardNumber}/increase-view-count")
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(
            @PathVariable("boardNumber") Integer boardNumber
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication))
            return ResponseDto.validationFailed();
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super IncreaseViewCountResponseDto> response = boardService.increaseViewCount(boardNumber, principal.getEmail());
        return response;
    }
}