package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.dto.request.board.PatchBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostBoardRequestDto;
import com.gangsan21.cms.dto.request.board.PostCommentRequestDto;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.board.*;
import com.gangsan21.cms.dto.response.user.GetUserBoardListResponseDto;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber, String email) {

        GetBoardResultSet resultSet;
        List<ImageEntity> imageEntityList;

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

        List<BoardListViewEntity> boardListViewEntityList;

        try {
            // 일주일 전 날짜 구함
            LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(4);

            boardListViewEntityList = boardListViewRepository.findTop12ByWriterEmailAndWriteDateTimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDateTimeDesc(email, lastWeek);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetTop3BoardListResponseDto.success(boardListViewEntityList);

    }

    @Override
    public ResponseEntity<? super GetSearchBoardResponseDto> getSearchBoardList(String searchWord, String preSearchWord, String email) {

        List<BoardListViewEntity> boardListViewEntityList;

        try {

            boardListViewEntityList = boardListViewRepository.findByWriterEmailAndTitleContainsOrContentContainsOrderByWriteDateTimeDesc(email, searchWord, preSearchWord);

            SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord, preSearchWord, false);
            searchLogRepository.save(searchLogEntity);

            // 이전 검색 기록을 한번 타고 나오는지 아니면, 첫 검색인지 (?)
            // preSearchWord 가 null 이 아니면 첫 번째 검색이 아니라는 뜻.
            boolean relation = preSearchWord != null;

            // 두번째 검색인 경우
            if (relation) {
                // 새로운 검색 엔티티 생성하되, preSearchWord 와 searchWord 순서 변경
                searchLogEntity = new SearchLogEntity(preSearchWord, searchWord, true);
                searchLogRepository.save(searchLogEntity);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSearchBoardResponseDto.success(boardListViewEntityList);
    }

    @Override
    public ResponseEntity<? super GetUserBoardListResponseDto> getUserBoardList(String email) {

        List<BoardListViewEntity> boardListViewEntityList;

        try {

            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return GetUserBoardListResponseDto.notExistUser();

            boardListViewEntityList = boardListViewRepository.findByWriterEmailOrderByWriteDateTimeDesc(email);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetUserBoardListResponseDto.success(boardListViewEntityList);
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

    @Override
    public ResponseEntity<? super PatchSuccessBoardResponseDto> patchSuccessBoard(Integer boardNumber, String email) {

        try {
            // boardNumber & email 기준 해당 업무를 찾아 isSucceed 플래그 toggle 설정 후 저장.
            BoardEntity targetEntity = boardRepository.findByBoardNumberAndWriterEmail(boardNumber, email);

            if(Objects.isNull(targetEntity)) return PatchSuccessBoardResponseDto.notExistBoard();

            targetEntity.succeedStatusToggle();
            boardRepository.save(targetEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchSuccessBoardResponseDto.success();
    }
}

