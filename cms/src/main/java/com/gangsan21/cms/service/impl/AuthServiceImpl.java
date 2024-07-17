package com.gangsan21.cms.service.impl;


import com.gangsan21.cms.dto.request.auth.SignInRequestDto;
import com.gangsan21.cms.dto.request.auth.SignUpRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.auth.SignInResponseDto;
import com.gangsan21.cms.dto.response.auth.SignUpResponseDto;
import com.gangsan21.cms.entity.UserEntity;
import com.gangsan21.cms.provider.JwtProvider;
import com.gangsan21.cms.repository.UserRepository;
import com.gangsan21.cms.service.AuthService;
import com.gangsan21.cms.util.encryption.StringEncryptorUtil;
import com.gangsan21.cms.util.validation.UserValidationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor // final 로 생성된 필수 필드에 대한 생성자 자동 생성
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserValidationUtil userValidationUtil;
    private final StringEncryptorUtil stringEncryptorUtil;
    private final JwtProvider jwtProvider;

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try {
            ResponseEntity<? super SignUpResponseDto> validateRes = userValidationUtil.validateUser(dto);

            if (!Objects.equals(validateRes, ResponseEntity.ok().build())) {
                return validateRes;
            }

            // 비밀번호 암호화 후 재설정
            String encodedPw = stringEncryptorUtil.encodeString(dto.getPassword());
            dto.setPassword(encodedPw);

            // 유저 저장
            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null;

        try {

            String email = dto.getEmail();
            UserEntity userEntity = userRepository.findByEmail(email);

            if (Objects.isNull(userEntity)) {
                return SignInResponseDto.signInFailed();
            }

            // 실제 pw 와 db 의 암호화 된 pw 를 비교
            boolean isMatched = stringEncryptorUtil.isMatched(dto.getPassword(), userEntity.getPassword());
            if(! isMatched) return SignInResponseDto.signInFailed();

            token = jwtProvider.create(email);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignInResponseDto.success(token);
    }
}
