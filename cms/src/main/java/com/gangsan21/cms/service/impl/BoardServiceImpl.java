package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.request.board.PatchBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostCommentRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.*;
import com.gangsan21.cms.entity.*;
import com.gangsan21.cms.repository.*;
import com.gangsan21.cms.repository.resultSet.GetBoardResultSet;
import com.gangsan21.cms.repository.resultSet.GetCommentListResultSet;
import com.gangsan21.cms.repository.resultSet.GetFavoriteListResultSet;
import com.gangsan21.cms.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardListViewRepository boardListViewRepository;
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber, String email) {

        GetBoardResultSet resultSet = null;
        List<ImageEntity> imageEntityList = new ArrayList<>();

        try {

            resultSet = boardRepository.getBoard(boardNumber, email);
            if (Objects.isNull(resultSet)) return GetBoardResponseDto.notExistBoard();

            imageEntityList = imageRepository.findByBoardNumber(boardNumber);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetBoardResponseDto.success(resultSet, imageEntityList);
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
    public ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, Integer boardNumber, String email) {

        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber, email);
            if (Objects.isNull(boardEntity)) return PatchBoardResponseDto.notExistBoard();

            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return PatchBoardResponseDto.notExistUser();

            String writerEmail = boardEntity.getWriterEmail();
            boolean isWriter = writerEmail.equals(email);
            if(!isWriter) return PatchBoardResponseDto.noPermission();

            // 기존 게시물 제목 및 내용 Update 수행
            boardEntity.patchBoard(dto);
            boardRepository.save(boardEntity);

            // 기존 게시물 이미지 제거
            imageRepository.deleteByBoardNumber(boardNumber);

            // 게시물 이미지 재 저장
            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntityList = new ArrayList<>();
            boardImageList.forEach(imgUrl -> {
                imageEntityList.add(new ImageEntity(boardNumber, imgUrl));
            });
            imageRepository.saveAll(imageEntityList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchBoardResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer boardNumber, String email) {

        try {

            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteBoardResponseDto.notExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber, email);
            if (Objects.isNull(boardEntity)) return DeleteBoardResponseDto.notExistBoard();

            String writerEmail = boardEntity.getWriterEmail();
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter) return DeleteBoardResponseDto.noPermission();

            imageRepository.deleteByBoardNumber(boardNumber);
            commentRepository.deleteByBoardNumber(boardNumber);
            favoriteRepository.deleteByBoardNumber(boardNumber);

            boardRepository.delete(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteBoardResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList(String email) {
        List<BoardListViewEntity> boardEntityList;

        try {
            boardEntityList = boardListViewRepository.findByWriterEmailOrderByWriteDateTimeDesc(email);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetLatestBoardListResponseDto.success(boardEntityList);
    }

    @Override
    public ResponseEntity<? super GetTop3BoardListResponseDto> getTop3BoardList(String email) {

        List<BoardListViewEntity> boardListViewEntityList = new ArrayList<>();

        try {
            // 일주일 전 날짜 구함
            LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(1);

            boardListViewEntityList = boardListViewRepository.findTop3ByWriterEmailAndWriteDateTimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDateTimeDesc(email, lastWeek);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetTop3BoardListResponseDto.success(boardListViewEntityList);

    }

    @Override
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber, String email) {

        List<GetFavoriteListResultSet> resultSetList;

        try {

            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) {
                return GetFavoriteListResponseDto.notExistUser();
            }

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
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email) {

        try {

            boolean isExistedUser = userRepository.existsByEmail(email);
            if (!isExistedUser) return PutFavoriteResponseDto.notExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber ,email);
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

    @Override
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber, String email) {

        List<GetCommentListResultSet> resultSetList = new ArrayList<>();

        try {

            boolean isExistedUser = userRepository.existsByEmail(email);
            if(!isExistedUser) return GetCommentListResponseDto.validationFailed();

            boolean isExistedBoard = boardRepository.existsByBoardNumberAndWriterEmail(boardNumber, email);
            if(!isExistedBoard) return GetCommentListResponseDto.notExistBoard();

            resultSetList = commentRepository.getCommentListByBoardNumberAndEmail(boardNumber, email);
//            log.info("nicknames: {}", resultSetList.stream().map(GetCommentListResultSet::getNickName).collect(Collectors.joining(",")));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetCommentListResponseDto.success(resultSetList);
    }

    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber, String email) {

        try {
            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return PostCommentResponseDto.notExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber, email);
            if (Objects.isNull(boardEntity)) return PostCommentResponseDto.notExistBoard();

            commentRepository.save(new CommentEntity(dto, boardNumber, email));

            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PostCommentResponseDto.success();
    }

    @Override
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer boardNumber, String email) {
        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber, email);
            if(Objects.isNull(boardEntity)) return IncreaseViewCountResponseDto.notExistBoard();

            boardEntity.increaseViewCount();
            boardRepository.save(boardEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IncreaseViewCountResponseDto.success();
    }
}

