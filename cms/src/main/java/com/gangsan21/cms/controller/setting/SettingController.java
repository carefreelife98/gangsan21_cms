package com.gangsan21.cms.controller.setting;

import com.gangsan21.cms.dto.request.setting.PatchSettingRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.setting.GetSettingResponseDto;
import com.gangsan21.cms.dto.response.setting.PatchSettingResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.SchedulerService;
import com.gangsan21.cms.service.SettingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/v1/setting")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;
    private final SchedulerService schedulerService;

    @GetMapping("")
    public ResponseEntity<? super GetSettingResponseDto> getSetting() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super GetSettingResponseDto> response = settingService.getSetting(userDetails.getEmail());
        return response;
    }

    @PatchMapping("")
    public ResponseEntity<? super PatchSettingResponseDto> updateSetting(
            HttpServletRequest request,
            @RequestBody @Valid PatchSettingRequestDto patchAlarmDto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        settingService.saveSetting(userDetails.getEmail(), patchAlarmDto.getCron());
        schedulerService.stopScheduler();
        String host = "http://cms.gangsan21-ocr.site";
        schedulerService.startScheduler(host);

        return PatchSettingResponseDto.success();
    }
}
