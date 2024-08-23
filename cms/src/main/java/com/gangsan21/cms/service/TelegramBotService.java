package com.gangsan21.cms.service;

public interface TelegramBotService {
    void checkAndSendAlarm(String userEmail);
    void sendMessage(String message);
}
