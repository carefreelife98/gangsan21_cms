package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.entity.BoardListViewEntity;
import com.gangsan21.cms.repository.BoardListViewRepository;
import com.gangsan21.cms.service.BotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.gangsan21.cms.util.validation.DateValidationUtil.checkDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelegramBotServiceImpl implements BotService {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final WebClient webClient;
    private final BoardListViewRepository boardListViewRepository;

    @Override
    public void sendMessage(String message) {
        String url = String.format("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=markdown", botToken, chatId, message);

        Mono<String> responseMono = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class);

        responseMono.subscribe(
                response -> log.info("[Scheduler] Telegram Bot API Call Succeed"),
                error -> error.printStackTrace()
        );
    }

    @Override
    public void checkAndSendAlarmByWeek(String userEmail, String requestUrl) {
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
                sb.append("*[강산 21 업무 알림]*\n");
                sb.append("\n------------------------------------\n");
                sb.append("*금주 업무:* ").append("\n");
                todayBoardList.forEach(boardListViewEntity -> {
//                    LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
//                    LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                    String title = boardListViewEntity.getTitle();
                    Integer boardNumber = boardListViewEntity.getBoardNumber();
                    sb.append("`업무:` ").append("[" + title + "]" + "(" + requestUrl + "/board/detail/"  + boardNumber + ")").append("\n");
//                    sb.append("`업무 기간:` ").append(startDt).append(" ~ ").append(endDt).append("\n");
                });

                sb.append("\n------------------------------------\n");
                sb.append("*지난주 업무:* ").append("\n");
                lastWeekBoardList.forEach(boardListViewEntity -> {
//                    LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
//                    LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                    String title = boardListViewEntity.getTitle();
                    Integer boardNumber = boardListViewEntity.getBoardNumber();
                    sb.append("`업무:` ").append("[" + title + "]" + "(" + requestUrl + "/board/detail/"  + boardNumber + ")").append("\n");
//                    sb.append("`업무 기간:` ").append(startDt).append(" ~ ").append(endDt).append("\n");
                });

                sb.append("\n------------------------------------\n");
                sb.append("*차주 업무:* ").append("\n");
                nextWeekBoardList.forEach(boardListViewEntity -> {
//                    LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
//                    LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                    String title = boardListViewEntity.getTitle();
                    Integer boardNumber = boardListViewEntity.getBoardNumber();
                    sb.append("`업무:` ").append("[" + title + "]" + "(" + requestUrl + "/board/detail/"  + boardNumber + ")").append("\n");
//                    sb.append("`업무 기간:` ").append(startDt).append(" ~ ").append(endDt).append("\n");
                });

                sendMessage(sb.toString());
                sb.setLength(0);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void checkAndSendAlarmBySuccess(String userEmail, String requestUrl) {

    }
}
