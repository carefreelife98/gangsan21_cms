package com.gangsan21.cms.service;

import com.gangsan21.cms.dto.response.util.GetBoardImageUrlsResponseDto;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    // File 을 받아온 후 해당 File 에 접근할 수 있는 url 로 반환.
    String upload(MultipartFile file) throws IOException;

    // url 을 통해 이미지 리소스를 반환
    Resource getImage(String fileName);

    // board number 에 매핑된 전체 이미지 url 을 반환.
    ResponseEntity<? super GetBoardImageUrlsResponseDto> getImageUrlsByBoardNumber(Integer boardNumber, String userEmail);

}
