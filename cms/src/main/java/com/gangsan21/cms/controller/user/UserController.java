package com.gangsan21.cms.controller.user;

import com.gangsan21.cms.dto.request.user.PatchNickNameRequestDto;
import com.gangsan21.cms.dto.request.user.PatchProfileImageRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.dto.response.user.GetUserResponseDto;
import com.gangsan21.cms.dto.response.user.PatchNickNameResponseDto;
import com.gangsan21.cms.dto.response.user.PatchProfileImageResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

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

    @GetMapping("/{email}")
    public ResponseEntity<? super GetUserResponseDto> getUser(@PathVariable String email) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        if(!principal.getEmail().equals(email)) return ResponseDto.validationFailed();

        ResponseEntity<? super GetUserResponseDto> response = userService.getUser(email);
        return response;
    }

    @PatchMapping("/nickname")
    public ResponseEntity<? super PatchNickNameResponseDto> updateNickname(
            @RequestBody @Valid PatchNickNameRequestDto requestBody,
            @AuthenticationPrincipal String email
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super PatchNickNameResponseDto> response = userService.patchNickName(requestBody, principal.getEmail());
        return response;
    }

    @PatchMapping("/profile-image")
    public ResponseEntity<? super PatchProfileImageResponseDto> updateProfileImage(
            @RequestBody @Valid PatchProfileImageRequestDto requestBody,
            @AuthenticationPrincipal String email
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        ResponseEntity<? super PatchProfileImageResponseDto> response = userService.patchProfileImage(requestBody, principal.getEmail());

        return response;
    }
}
