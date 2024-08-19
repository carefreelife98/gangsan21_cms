package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.request.user.PatchNickNameRequestDto;
import com.gangsan21.cms.dto.request.user.PatchProfileImageRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.dto.response.user.GetUserResponseDto;
import com.gangsan21.cms.dto.response.user.PatchNickNameResponseDto;
import com.gangsan21.cms.dto.response.user.PatchProfileImageResponseDto;
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

    @Override
    public ResponseEntity<? super GetUserResponseDto> getUser(String email) {

        UserEntity userEntity;

        try {

            userEntity = userRepository.findByEmail(email);
            if (Objects.isNull(userEntity)) return GetUserResponseDto.notExistUser();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetUserResponseDto.success(userEntity);
    }

    @Override
    public ResponseEntity<? super PatchNickNameResponseDto> patchNickName(PatchNickNameRequestDto dto, String email) {

        try {

            UserEntity userEntity = userRepository.findByEmail(email);
            if (Objects.isNull(userEntity)) return PatchNickNameResponseDto.notExistUser();

            String nickName = dto.getNickName();
            boolean existedNickName = userRepository.existsByNickName(nickName);
            if (existedNickName) return PatchNickNameResponseDto.duplicateNickName();

            userEntity.setNickName(nickName);
            userRepository.save(userEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchNickNameResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(PatchProfileImageRequestDto dto, String email) {
        try {

            UserEntity userEntity = userRepository.findByEmail(email);
            if (Objects.isNull(userEntity)) return PatchProfileImageResponseDto.notExistUser();

            String profileImage = dto.getProfileImage();
            userEntity.setProfileImage(profileImage);
            userRepository.save(userEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchProfileImageResponseDto.success();
    }
}
