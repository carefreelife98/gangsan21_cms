package com.gangsan21.cms.service;


import com.gangsan21.cms.dto.request.auth.SignInRequestDto;
import com.gangsan21.cms.dto.request.auth.SignUpRequestDto;
import com.gangsan21.cms.dto.response.auth.SignInResponseDto;
import com.gangsan21.cms.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    // 부모 타입까지 같이 반환하도록 ? super 사용
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}
