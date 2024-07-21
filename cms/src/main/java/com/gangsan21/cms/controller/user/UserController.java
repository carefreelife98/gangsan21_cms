package com.gangsan21.cms.controller.user;

import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // @AuthenticationPrincipal:
    // - Controller 에서 Filter > UsernamePasswordAuthenticationToken 에 담긴 사용자의 email 정보를 가져올 수 있도록 하는 annot.
    @GetMapping("")
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        // TODO: @AuthenticationPrincipal 동작하지 않아 임시 방편으로 아래와 같이 SecurityContextHolder 에서 직접 꺼내 사용.
        //  추후 @AuthenticationPrincipal 사용으로 변경 필요
        CustomUserDetails principal = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ResponseEntity<? super GetSignInUserResponseDto> response = userService.getSignInUser(principal.getEmail());
        return response;
    }
}
