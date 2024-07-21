package com.gangsan21.cms.controller.board;

import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(
            @RequestBody @Valid PostBoardRequestDto requestBody,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        // TODO: @AuthenticationPrincipal 동작하지 않아 임시 방편으로 아래와 같이 SecurityContextHolder 에서 직접 꺼내 사용.
        //  추후 @AuthenticationPrincipal 사용으로 변경 필요
        CustomUserDetails principal = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ResponseEntity<? super PostBoardResponseDto> response = boardService.postBoard(requestBody, principal.getEmail());

        return response;
    }
}