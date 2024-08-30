package com.gangsan21.cms.date;

import com.gangsan21.cms.CmsApplication;
import com.gangsan21.cms.entity.BoardListViewEntity;
import com.gangsan21.cms.repository.BoardListViewRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.gangsan21.cms.util.validation.DateValidationUtil.checkDate;

@SpringBootTest
@ContextConfiguration(classes = CmsApplication.class)
public class CheckDateTest {

    @Autowired
    BoardListViewRepository boardListViewRepository;

    @Test
    public void testCheckDate() {

        List<BoardListViewEntity> boardList = boardListViewRepository.find2WeeksBoardListByEmail("gs001");

        System.out.println(boardList.stream().map(BoardListViewEntity::getTitle).collect(Collectors.joining(", ")));

        boardList.forEach(board -> {
            LocalDateTime startDt = board.getStartDt();
            LocalDateTime endDt = board.getEndDt();

            String res = checkDate(startDt, endDt);
            System.out.println("res: " + res);
        });
    }

}
