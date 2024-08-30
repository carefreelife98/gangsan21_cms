package com.gangsan21.cms.util.validation;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DateValidationUtil {

    public static String checkDate(LocalDateTime startDateTimeToCheck, LocalDateTime endDateTimeToCheck) {
        LocalDate today = LocalDate.now();
        LocalDate dateToCheckStart = startDateTimeToCheck.toLocalDate();
        LocalDate dateToCheckEnd = endDateTimeToCheck.toLocalDate();

        // 현재 주의 시작일과 끝일 계산
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        // 지난주와 다음주의 시작일과 끝일 계산
        LocalDate startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDate endOfLastWeek = endOfWeek.minusWeeks(1);
        LocalDate startOfNextWeek = startOfWeek.plusWeeks(1);
        LocalDate endOfNextWeek = endOfWeek.plusWeeks(1);

        //TODO: inThisWeek 가 금일 은 아니므로 "금일" 및 "이번주" 데이터를 나누어야 함.
        boolean inLastWeek = (dateToCheckStart.isBefore(endOfLastWeek.plusDays(1)) && dateToCheckEnd.isAfter(startOfLastWeek.minusDays(1)));
        boolean inThisWeek = (dateToCheckStart.isBefore(endOfWeek.plusDays(1)) && dateToCheckEnd.isAfter(startOfWeek.minusDays(1)));
        boolean inNextWeek = (dateToCheckStart.isBefore(endOfNextWeek.plusDays(1)) && dateToCheckEnd.isAfter(startOfNextWeek.minusDays(1)));

        if (inLastWeek && inThisWeek && inNextWeek) {
            return "LW_TD_NW";
        } else if (inLastWeek && inThisWeek) {
            return "LW_TD";
        } else if (inThisWeek && inNextWeek) {
            return "TD_NW";
        } else if (inLastWeek) {
            return "LW";
        } else if (inThisWeek) { //TODO: inThisWeek 가 금일 은 아니므로 "금일" 및 "이번주" 데이터를 나누어야 함.
            return "TD";
        } else if (inNextWeek) {
            return "NW";
        } else {
            return "ERR";
        }
    }
}
