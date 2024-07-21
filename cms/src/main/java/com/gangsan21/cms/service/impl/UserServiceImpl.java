package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.entity.UserEntity;
import com.gangsan21.cms.repository.UserRepository;
import com.gangsan21.cms.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {

        UserEntity userEntity = null;

        try {

            userEntity = userRepository.findByEmail(email);
            if (Objects.isNull(userEntity)) return GetSignInUserResponseDto.notExistUser();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetSignInUserResponseDto.success(userEntity);
    }
}
