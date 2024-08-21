package com.gangsan21.cms.service;

import org.springframework.scheduling.Trigger;

public interface SchedulerService {
    void startScheduler(Runnable runnable, Trigger trigger);
    void stopScheduler();
    void updateCronSet(String cron);
}
