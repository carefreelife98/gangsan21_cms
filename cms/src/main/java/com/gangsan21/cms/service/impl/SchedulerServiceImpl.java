package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerServiceImpl implements SchedulerService {

    private ThreadPoolTaskScheduler taskScheduler;
    private String cron = "0 0/5 * * * ?";

    @Override
    public void startScheduler(Runnable runnable, Trigger trigger) {
        taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(1);
        taskScheduler.setThreadNamePrefix("CMS ThreadPoolTaskScheduler");
        taskScheduler.initialize();
        taskScheduler.schedule(runnable, trigger);
    }

    @Override
    public void stopScheduler() {
        taskScheduler.shutdown();
    }

    @Override
    public void updateCronSet(String cron) {
        this.cron = cron;
    }

//    @Override
//    public void schedule() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (Objects.isNull(authentication)) {
//            log.warn("Scheduler Service :: schedule() :: authentication is null");
//            return;
//        }
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//
//        String email = userDetails.getEmail();
//
//        SettingEntity setting = settingRepository.findByUserEmail(email);
//        if (Objects.isNull(setting)) {return;}
//
//        // TODO: Setting Entity - Cron 식으로 저장되어야 함.
//        String alarmPeriod = setting.getAlarmPeriod();
//        log.info("User: {} 의 AlarmPeriod: {} 에 따라 스케줄링을 시작합니다.", email, alarmPeriod);
//
//        taskScheduler.initialize();
//        taskScheduler.schedule(
//                new TelegramTask(telegramBotService),
//                new CronTrigger(alarmPeriod, ZoneId.systemDefault())
//        );
//
//    }
}
