package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.GetBoardResponseDto;
import com.gangsan21.cms.dto.response.board.GetFavoriteListResponseDto;
import com.gangsan21.cms.dto.response.board.PostBoardResponseDto;
import com.gangsan21.cms.dto.response.board.PutFavoriteResponseDto;
import com.gangsan21.cms.entity.BoardEntity;
import com.gangsan21.cms.entity.FavoriteEntity;
import com.gangsan21.cms.entity.ImageEntity;
import com.gangsan21.cms.repository.BoardRepository;
import com.gangsan21.cms.repository.FavoriteRepository;
import com.gangsan21.cms.repository.ImageRepository;
import com.gangsan21.cms.repository.UserRepository;
import com.gangsan21.cms.repository.resultSet.GetBoardResultSet;
import com.gangsan21.cms.repository.resultSet.GetFavoriteListResultSet;
import com.gangsan21.cms.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.PropertyResolver;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final FavoriteRepository favoriteRepository;

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber, String email) {

        GetBoardResultSet resultSet = null;
        List<ImageEntity> imageEntityList = new ArrayList<>();

        try {

            resultSet = boardRepository.getBoard(boardNumber, email);
            if (Objects.isNull(resultSet)) return GetBoardResponseDto.notExistBoard();

            imageEntityList = imageRepository.findByBoardNumber(boardNumber);

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            boardEntity.increaseViewCount();
            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetBoardResponseDto.success(resultSet, imageEntityList);
    }

    @Override
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber, String email) {

        List<GetFavoriteListResultSet> resultSetList;

        try {

            // 유저 자신이 작성한 게시물만 가져옴.
            boolean existedBoard = boardRepository.existsByBoardNumberAndWriterEmail(boardNumber, email);

            if(!existedBoard){
                return GetFavoriteListResponseDto.notExistBoard();
            }

            resultSetList = favoriteRepository.getFavoriteList(boardNumber);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetFavoriteListResponseDto.success(resultSetList);
    }

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

    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email) {

        try {

            boolean isExistedUser = userRepository.existsByEmail(email);
            if (!isExistedUser) return PutFavoriteResponseDto.notExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (Objects.isNull(boardEntity)) return PutFavoriteResponseDto.notExistBoard();

            FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);
            if (Objects.isNull(favoriteEntity)) {
                favoriteEntity = new FavoriteEntity(email, boardNumber);
                favoriteRepository.save(favoriteEntity);
                boardEntity.increaseFavoriteCount();
            } else {
                favoriteRepository.delete(favoriteEntity);
                boardEntity.decreaseFavoriteCount();
            }

            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PutFavoriteResponseDto.success();
    }
}

