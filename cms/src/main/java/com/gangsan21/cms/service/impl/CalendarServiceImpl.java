package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.response.calendar.GetCalendarItemListResponseDto;
import com.gangsan21.cms.entity.BoardListViewEntity;
import com.gangsan21.cms.repository.BoardListViewRepository;
import com.gangsan21.cms.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {

    private final BoardListViewRepository boardListViewRepository;

    @Override
    public ResponseEntity<? super GetCalendarItemListResponseDto> getCalendarItemList(String email) {

        List<List<BoardListViewEntity>> boardEntitiesList = new ArrayList<>();

        //TODO: type 구분 필요. (추가 컬럼..)
        String color = "grey";
        String textColor = "white";

        try {
            // 작성자(Email) 의 모든 게시물을 불러온다.
            List<BoardListViewEntity> boardEntityList = boardListViewRepository.findAllByWriterEmail(email);

            //TODO: type 별로 구분하여 리스트 추가 필요. (추가 컬럼..)
            boardEntitiesList.add(boardEntityList);

        } catch (Exception e) {
            e.printStackTrace();
            return GetCalendarItemListResponseDto.databaseError();
        }

        return GetCalendarItemListResponseDto.success(boardEntitiesList, color, textColor);
    }
}
