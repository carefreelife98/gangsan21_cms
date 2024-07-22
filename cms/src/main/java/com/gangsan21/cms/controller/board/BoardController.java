package com.gangsan21.cms.controller.board;

import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.GetBoardResponseDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import com.gangsan21.cms.dto.response.board.PutFavoriteResponseDto;
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
}