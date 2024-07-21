package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import com.gangsan21.cms.entity.BoardEntity;
import com.gangsan21.cms.entity.ImageEntity;
import com.gangsan21.cms.repository.BoardRepository;
import com.gangsan21.cms.repository.ImageRepository;
import com.gangsan21.cms.repository.UserRepository;
import com.gangsan21.cms.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;

    @Override
    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {

        try {

            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostBoardResponseDto.notExistUser();

            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);

            int boardNumber = boardEntity.getBoardNumber();

            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntityList = new ArrayList<>();
            boardImageList.forEach(imgUrl -> {
                ImageEntity image = new ImageEntity(boardNumber, imgUrl);
                imageEntityList.add(image);
            });

            imageRepository.saveAll(imageEntityList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PostBoardResponseDto.success();
    }
}

