package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.entity.SettingEntity;
import com.gangsan21.cms.repository.SettingRepository;
import com.gangsan21.cms.service.BotService;
import com.gangsan21.cms.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerServiceImpl implements SchedulerService, Runnable{

    private ThreadPoolTaskScheduler taskScheduler;
    private String REQUEST_DOMAIN;

    @Value("${secrets.scheduler-email}")
    private String USER_EMAIL;

    // SlackBotServiceImpl 에 @Primary 적용하여 Telegram service 빈 주입 보다 우선하도록 함.
    //    private final BotService telegramBotService;
    @Qualifier("slackBotServiceImpl")
    private final BotService slackBotService;

    private final SettingRepository settingRepository;

    @Override
    public void startScheduler(String requestUrl) {
        this.REQUEST_DOMAIN = requestUrl;

        taskScheduler = new ThreadPoolTaskScheduler() {
            @Override
            public void destroy() {
                // 지연된 작업 및 주기적 작업 무시 설정
                this.getScheduledThreadPoolExecutor().setExecuteExistingDelayedTasksAfterShutdownPolicy(false);
                this.getScheduledThreadPoolExecutor().setContinueExistingPeriodicTasksAfterShutdownPolicy(false);
                super.destroy();
            }
        };
        taskScheduler.setPoolSize(1);
        taskScheduler.setThreadNamePrefix("CMS ThreadPoolTaskScheduler");
        taskScheduler.initialize();

        SettingEntity settingEntity = settingRepository.findByUserEmail(USER_EMAIL);
        if (Objects.isNull(settingEntity)) {
            log.warn("User: {} 이/가 존재하지 않습니다.", USER_EMAIL);
            return;
        }
        String cronExpression = settingEntity.getAlarmPeriod();

        // 사용자의 AlarmPeriod 세팅 값이 비어있거나, "N" 인 경우는 알람 스케줄러 사용하지 않도록 함.
        if(Objects.isNull(cronExpression) || cronExpression.trim().isEmpty() || cronExpression.trim().equals("N")) {
            log.warn("User: {} 의 알람 설정 값이 \"사용하지 않음, N\" 으로 설정되어 있습니다.", USER_EMAIL);
            stopScheduler();
            return;
        }

        log.info("Start Slack Bot Scheduling ::: cron: {}", cronExpression);
        taskScheduler.schedule(this::run, new CronTrigger(cronExpression));
    }

    @Override
    public void stopScheduler() {
        if (taskScheduler != null) {
            // destroy 메서드 호출
            taskScheduler.destroy();
            // 스케줄러 명시적 종료
            taskScheduler.shutdown();

            log.warn("CMS ThreadPoolTaskScheduler has been stopped.");
        }
    }

    @Override
    public void run() {
        log.info("Scheduled Task Start :: Slack Bot");
        log.info(slackBotService.getClass().toString());
        slackBotService.checkAndSendAlarm(USER_EMAIL, REQUEST_DOMAIN);
        log.info("Scheduled Task End :: Slack Bot");
    }
}
