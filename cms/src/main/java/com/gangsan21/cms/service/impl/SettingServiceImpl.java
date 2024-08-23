package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.setting.GetSettingResponseDto;
import com.gangsan21.cms.dto.response.setting.PatchSettingResponseDto;
import com.gangsan21.cms.entity.SettingEntity;
import com.gangsan21.cms.repository.SettingRepository;
import com.gangsan21.cms.service.SettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;

    @Override
    public ResponseEntity<? super GetSettingResponseDto> getSetting(String email) {
        if (Objects.isNull(email)) return ResponseDto.validationFailed();

        SettingEntity setting;

        try {
            setting = settingRepository.findByUserEmail(email);
            if (Objects.isNull(setting)) return GetSettingResponseDto.notExistUser();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetSettingResponseDto.success(setting);
    }

    @Override
    public ResponseEntity<? super PatchSettingResponseDto> saveSetting(String email, String newCron) {
        if(Objects.isNull(email)) return PatchSettingResponseDto.validationFailed();

        try {
            SettingEntity settingEntity = settingRepository.findByUserEmail(email);
            settingEntity.setAlarmPeriod(newCron);
            settingRepository.save(settingEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchSettingResponseDto.success();
    }
}
