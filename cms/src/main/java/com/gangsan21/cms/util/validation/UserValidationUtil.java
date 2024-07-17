package com.gangsan21.cms.util.validation;

import com.gangsan21.cms.dto.request.auth.SignUpRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.auth.SignUpResponseDto;
import com.gangsan21.cms.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Component
@AllArgsConstructor
public class UserValidationUtil {

    private final UserRepository userRepository;

    public ResponseEntity<? super SignUpResponseDto> validateUser(SignUpRequestDto dto) {
        boolean isExistEmail = userRepository.existsByEmail(dto.getEmail());
        boolean isExistNickName = userRepository.existsByNickName(dto.getNickName());
        boolean isExistTelNumber = userRepository.existsByTelNumber(dto.getTelNumber());

        if (isExistEmail) {
            return SignUpResponseDto.duplicateEmail();
        } else if (isExistNickName) {
            return SignUpResponseDto.duplicateNickName();
        } else if (isExistTelNumber) {
            return SignUpResponseDto.duplicateTelNumber();
        } else return new ResponseEntity<>(HttpStatus.OK);
    }
}
