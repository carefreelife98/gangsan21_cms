package com.gangsan21.cms.controller.scheduler;

import com.gangsan21.cms.service.SchedulerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class ScheduleController {

    private final SchedulerService schedulerService;

    @PostMapping("/on")
    public void on(HttpServletRequest request) {
        String host = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        schedulerService.startScheduler(host);
    }

    @PostMapping("/off")
    public void off() {
        schedulerService.stopScheduler();
    }
}
