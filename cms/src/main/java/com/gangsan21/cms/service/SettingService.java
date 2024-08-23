package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.response.setting.GetSettingResponseDto;
import com.gangsan21.cms.dto.response.setting.PatchSettingResponseDto;
import org.springframework.http.ResponseEntity;

public interface SettingService {

    ResponseEntity<? super GetSettingResponseDto> getSetting(String email);

    ResponseEntity<? super PatchSettingResponseDto> saveSetting(String email, String newCron);
}
