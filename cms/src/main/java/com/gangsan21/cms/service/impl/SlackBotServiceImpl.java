package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.entity.BoardListViewEntity;
import com.gangsan21.cms.repository.BoardListViewRepository;
import com.gangsan21.cms.service.BotService;
import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.gangsan21.cms.util.validation.DateValidationUtil.checkDate;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class SlackBotServiceImpl implements BotService {

    @Value("${slack.bot.token}")
    private String botToken;

    @Value("${slack.channel.id}")
    private String CHANNEL_ID;

    private final BoardListViewRepository boardListViewRepository;

    // slack sdk 사용.
    @Override
    public void sendMessage(String message) {
        // you can get this instance via ctx.client() in a Bolt app
        var client = Slack.getInstance().methods();
        try {

            // Call the chat.postMessage method using the built-in WebClient
            var result = client.chatPostMessage(r -> r
                            // The token you used to initialize your app
                            .token(botToken)
                            .channel(CHANNEL_ID)
                            .text(message)
                    // You could also use a blocks[] array to send richer content
            );

        } catch (IOException | SlackApiException e) {
            log.error("Slack Bot API error: {}", e.getMessage(), e);
        }
    }

    @Override
    public void checkAndSendAlarm(String userEmail, String requestUrl) {
        try {
            // 오늘을 기준으로, 전주 및 다음주에 업무시작일이 설정된 업무 리스트 추출. (총 14일)
            List<BoardListViewEntity> weeklyBoardList = boardListViewRepository.find2WeeksBoardListByEmail(userEmail);

            List<BoardListViewEntity> todayBoardList = new ArrayList<>();
            List<BoardListViewEntity> lastWeekBoardList = new ArrayList<>();
            List<BoardListViewEntity> nextWeekBoardList = new ArrayList<>();
            if (!weeklyBoardList.isEmpty()) {

                // 업무 시작일 기준: 지난주, 오늘, 다음주 업무 분류.
                weeklyBoardList.forEach(boardListViewEntity -> {
                    LocalDateTime startDt = boardListViewEntity.getStartDt();
                    LocalDateTime endDt = boardListViewEntity.getEndDt();
                    String res = checkDate(startDt, endDt);
                    switch (res) {
                        case "LW_TD_NW":
                            lastWeekBoardList.add(boardListViewEntity);
                            todayBoardList.add(boardListViewEntity);
                            nextWeekBoardList.add(boardListViewEntity);
                            return;

                        case "LW":
                            lastWeekBoardList.add(boardListViewEntity);
                            return;

                        case "LW_TD":
                            lastWeekBoardList.add(boardListViewEntity);
                            todayBoardList.add(boardListViewEntity);
                            return;

                        case "TD":
                            todayBoardList.add(boardListViewEntity);
                            return;

                        case "TD_NW":
                            todayBoardList.add(boardListViewEntity);
                            nextWeekBoardList.add(boardListViewEntity);
                            return;

                        case "NW":
                            nextWeekBoardList.add(boardListViewEntity);
                    }
                });

                StringBuilder sb = new StringBuilder();
                sb.append("======================================\n");
                sb.append("*[강산 21 업무 알림]*\n");
                sb.append("======================================\n");
                sb.append("*금주 업무:* ").append("\n");
                if (todayBoardList.isEmpty()) {
                    sb.append(">등록된 금주 업무가 없습니다.");
                } else {
                    todayBoardList.forEach(boardListViewEntity -> {
                        String title = boardListViewEntity.getTitle();
                        Integer boardNumber = boardListViewEntity.getBoardNumber();
                        sb.append("* `업무:` ").append("<" + requestUrl + "/board/detail/" + boardNumber + "|" + title + ">").append("\n");
                    });
                }
                sb.append("\n------------------------------------\n");
                sb.append("*지난주 업무:* ").append("\n");
                if (lastWeekBoardList.isEmpty()) {
                    sb.append(">등록된 지난주 업무가 없습니다.");
                } else {
                    lastWeekBoardList.forEach(boardListViewEntity -> {
                        String title = boardListViewEntity.getTitle();
                        Integer boardNumber = boardListViewEntity.getBoardNumber();
                        sb.append("* `업무:` ").append("<" + requestUrl + "/board/detail/" + boardNumber + "|" + title + ">").append("\n");
                    });
                }

                sb.append("\n------------------------------------\n");
                sb.append("*차주 업무:* ").append("\n");
                if (nextWeekBoardList.isEmpty()) {
                    sb.append(">등록된 차주 업무가 없습니다.");
                } else {
                    nextWeekBoardList.forEach(boardListViewEntity -> {
                        String title = boardListViewEntity.getTitle();
                        Integer boardNumber = boardListViewEntity.getBoardNumber();
                        sb.append("* `업무:` ").append("<" + requestUrl + "/board/detail/"  + boardNumber + "|" + title + ">").append("\n");
                    });
                }
                sb.append("\n------------------------------------\n\n\n");

                sendMessage(sb.toString());
                sb.setLength(0);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
