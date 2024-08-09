package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.response.calendar.GetCalendarItemListResponseDto;
import org.springframework.http.ResponseEntity;

public interface CalendarService {

    ResponseEntity<? super GetCalendarItemListResponseDto> getCalendarItemList(String email);

}
