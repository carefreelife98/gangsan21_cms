package com.gangsan21.cms.service;

public interface BotService {
    void checkAndSendAlarm(String userEmail, String requestUrl);
    void sendMessage(String message);
}
