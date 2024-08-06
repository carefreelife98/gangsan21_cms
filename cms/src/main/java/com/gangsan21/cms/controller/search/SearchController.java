package com.gangsan21.cms.controller.search;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.GetRelationListResponseDto;
import com.gangsan21.cms.dto.response.search.GetPopularListResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/popular-list")
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList(
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication))
            return ResponseDto.validationFailed();

        ResponseEntity<? super GetPopularListResponseDto> response = searchService.getPopularList();
        return response;
    }

    @GetMapping("/{searchWord}/relation-list")
    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(
            @PathVariable("searchWord") String searchWord,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();

        ResponseEntity<? super GetRelationListResponseDto> response = searchService.getRelationList(searchWord);
        return response;
    }
}
