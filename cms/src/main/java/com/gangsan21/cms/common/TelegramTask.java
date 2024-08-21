//package com.gangsan21.cms.common;
//
//import com.gangsan21.cms.service.impl.TelegramBotServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class TelegramTask implements Runnable {
//
//    private final TelegramBotServiceImpl telegramBotService;
//
//    @Override
//    public void run() {
//        // 각 스레드 별 스프링 시큐리티 컨텍스트의 사용자 이메일을 추출하여 구분된 알림 발송.
//        telegramBotService.checkToSendAlarm();
//    }
//}
