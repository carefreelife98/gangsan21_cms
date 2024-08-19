package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.response.user.GetSignInUserResponseDto;
import com.gangsan21.cms.dto.response.user.GetUserResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super GetUserResponseDto> getUser(String email);

}
