package com.gangsan21.cms.controller.calendar;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.calendar.GetCalendarItemListResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.CalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping()
    public ResponseEntity<? super GetCalendarItemListResponseDto> getCalendarItemList(
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        ResponseEntity<? super GetCalendarItemListResponseDto> response = calendarService.getCalendarItemList(principal.getEmail());
        log.info(response.toString());
        return response;
    }

}
