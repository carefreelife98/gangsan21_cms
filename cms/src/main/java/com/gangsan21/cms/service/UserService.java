package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.request.user.PatchNickNameRequestDto;
import com.gangsan21.cms.dto.request.user.PatchProfileImageRequestDto;
import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.dto.response.user.GetUserResponseDto;
import com.gangsan21.cms.dto.response.user.PatchNickNameResponseDto;
import com.gangsan21.cms.dto.response.user.PatchProfileImageResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super GetUserResponseDto> getUser(String email);
    ResponseEntity<? super PatchNickNameResponseDto> patchNickName(PatchNickNameRequestDto dto, String email);
    ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(PatchProfileImageRequestDto dto, String email);
}
