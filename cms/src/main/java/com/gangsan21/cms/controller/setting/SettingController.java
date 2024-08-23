package com.gangsan21.cms.controller.setting;

import com.gangsan21.cms.dto.request.setting.PatchSettingRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.setting.PatchSettingResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.SchedulerService;
import com.gangsan21.cms.service.SettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/api/v1/setting")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;
    private final SchedulerService schedulerService;

    @PatchMapping("/update-period")
    public ResponseEntity<? super PatchSettingResponseDto> updateAlarm(
            @RequestBody @Valid PatchSettingRequestDto patchAlarmDto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        settingService.saveSetting(userDetails.getEmail(), patchAlarmDto.getCron());
        schedulerService.stopScheduler();
        schedulerService.startScheduler();

        return PatchSettingResponseDto.success();
    }
}
