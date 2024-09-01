package com.gangsan21.cms.service;

public interface BotService {
    void checkAndSendAlarmByWeek(String userEmail, String requestUrl);
    void checkAndSendAlarmBySuccess(String userEmail, String requestUrl);
    void sendMessage(String message);
}
