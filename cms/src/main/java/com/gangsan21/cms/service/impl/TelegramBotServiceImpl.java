package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.entity.BoardListViewEntity;
import com.gangsan21.cms.repository.BoardListViewRepository;
import com.gangsan21.cms.service.TelegramBotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TelegramBotServiceImpl implements TelegramBotService {

    @Value("${telegram.bot.base-url}")
    private String BASE_URL;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final WebClient webClient;
    private final BoardListViewRepository boardListViewRepository;

    public TelegramBotServiceImpl(WebClient.Builder webClientBuilder, BoardListViewRepository boardListViewRepository) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
        this.boardListViewRepository = boardListViewRepository;
    }

    @Override
    public void sendMessage(String message) {
        String url = String.format("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s", botToken, chatId, message);

        Mono<String> responseMono = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class);

//        responseMono.subscribe(System.out::println);
        responseMono.subscribe(
                response -> System.out.println("[Scheduler] Telegram Bot API Response: " + response),
                error -> error.printStackTrace()
        );
    }

    public static String checkDate(LocalDateTime dateTimeToCheck, LocalDateTime now) {
        LocalDate today = now.toLocalDate();
        LocalDate dateToCheck = dateTimeToCheck.toLocalDate();

        // 주의 시작일과 끝일 계산
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        // 지난주와 다음주의 시작일과 끝일 계산
        LocalDate startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDate endOfLastWeek = endOfWeek.minusWeeks(1);
        LocalDate startOfNextWeek = startOfWeek.plusWeeks(1);
        LocalDate endOfNextWeek = endOfWeek.plusWeeks(1);

        // 날짜 범위 확인
        if (dateToCheck.isEqual(today)) {
            return "TODAY";
        } else if (dateToCheck.isAfter(startOfLastWeek) && dateToCheck.isBefore(endOfLastWeek.plusDays(1))) {
            return "LW";
        } else if (dateToCheck.isAfter(startOfNextWeek.minusDays(1)) && dateToCheck.isBefore(endOfNextWeek.plusDays(1))) {
            return "NW";
        } else {
            return "ERR";
        }
    }

//    @Scheduled(fixedRate = 60000) // 60 초마다 체크 및 Board 시간
    public void checkToSendAlarm() {
        // 오늘을 기준으로, 전주 및 다음주에 업무시작일이 설정된 업무 리스트 추출. (총 14일)
        List<BoardListViewEntity> weeklyBoardList = boardListViewRepository.find2WeeksBoardList();

        List<BoardListViewEntity> todayBoardList = new ArrayList<>();
        List<BoardListViewEntity> lastWeekBoardList = new ArrayList<>();
        List<BoardListViewEntity> nextWeekBoardList = new ArrayList<>();
        if (!weeklyBoardList.isEmpty()) {

            // 업무 시작일 기준: 지난주, 오늘, 다음주 업무 분류.
            weeklyBoardList.forEach(boardListViewEntity -> {
                LocalDateTime startDt = boardListViewEntity.getStartDt();
                String res = checkDate(startDt, LocalDateTime.now());
                switch (res) {
                    case "TODAY": todayBoardList.add(boardListViewEntity);
                    return;
                    case "LW": lastWeekBoardList.add(boardListViewEntity);
                    return;
                    case "NW": nextWeekBoardList.add(boardListViewEntity);
                }
            });

            StringBuilder sb = new StringBuilder();

            sb.append("금일 업무: ").append("\n");
            todayBoardList.forEach(boardListViewEntity -> {
                LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
                LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                String title = boardListViewEntity.getTitle();
                String content = boardListViewEntity.getContent();
                sb.append("업무 기간: ").append(startDt).append(" ~ ").append(endDt).append("\n");
                sb.append("제목: ").append(title).append("\n");
                sb.append("내용: ").append(content).append("\n\n");
            });

            sendMessage(sb.toString());
            sb.setLength(0);

            sb.append("지난주 업무: ").append("\n");
            lastWeekBoardList.forEach(boardListViewEntity -> {
                LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
                LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                String title = boardListViewEntity.getTitle();
                String content = boardListViewEntity.getContent();
                sb.append("업무 기간: ").append(startDt).append(" ~ ").append(endDt).append("\n");
                sb.append("제목: ").append(title).append("\n");
                sb.append("내용: ").append(content).append("\n\n");
            });

            sendMessage(sb.toString());
            sb.setLength(0);

            sb.append("차주 업무: ").append("\n");
            nextWeekBoardList.forEach(boardListViewEntity -> {
                LocalDate startDt = boardListViewEntity.getStartDt().toLocalDate();
                LocalDate endDt = boardListViewEntity.getEndDt().toLocalDate();
                String title = boardListViewEntity.getTitle();
                String content = boardListViewEntity.getContent();
                sb.append("업무 기간: ").append(startDt).append(" ~ ").append(endDt).append("\n");
                sb.append("제목: ").append(title).append("\n");
                sb.append("내용: ").append(content).append("\n\n");
            });

            sendMessage(sb.toString());
            sb.setLength(0);
        }
    }
}
