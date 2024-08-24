package com.gangsan21.cms.service;

public interface TelegramBotService {
    void checkAndSendAlarm(String userEmail, String requestUrl);
    void sendMessage(String message);
}
