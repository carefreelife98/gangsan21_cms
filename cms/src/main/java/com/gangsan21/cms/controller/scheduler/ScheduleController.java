package com.gangsan21.cms.controller.scheduler;

import com.gangsan21.cms.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class ScheduleController {

    private final SchedulerService schedulerService;

    @PostMapping("/on")
    public void on() {
        schedulerService.startScheduler();
    }

    @PostMapping("/off")
    public void off() {
        schedulerService.stopScheduler();
    }
}
