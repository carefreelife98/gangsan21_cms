package com.gangsan21.cms.controller.scheduler;

import com.gangsan21.cms.dto.request.scheduler.PatchAlarmDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.impl.TelegramBotServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class ScheduleController {

    private final TelegramBotServiceImpl telegramBotService;

    @PostMapping("/on")
    public void on() {
        telegramBotService.init();
    }

    @PostMapping("/off")
    public void off() {
        telegramBotService.endScheduling();
    }

    @PatchMapping("/update-period")
    public void updatePeriod(@RequestBody PatchAlarmDto patchAlarmDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) {return;}
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        telegramBotService.saveSetting(userDetails.getEmail(), patchAlarmDto.getCron());
        telegramBotService.endScheduling();
        telegramBotService.init();
    }
}
