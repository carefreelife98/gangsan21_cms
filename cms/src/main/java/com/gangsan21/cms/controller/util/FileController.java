package com.gangsan21.cms.controller.util;

import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.dto.response.util.GetBoardImageUrlsResponseDto;
import com.gangsan21.cms.security.CustomUserDetails;
import com.gangsan21.cms.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public String upload(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String url = fileService.upload(file);
        return url;
    }

    @GetMapping(value = "/{fileName}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public Resource getImage(
            @PathVariable("fileName") String fileName
    ) {
        Resource resource = fileService.getImage(fileName);
        return resource;
    }

    @GetMapping("/urls/{boardNumber}")
    public ResponseEntity<? super GetBoardImageUrlsResponseDto> getImageUrlsByBoardNumber(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable("boardNumber") Integer boardNumber
    ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(Objects.isNull(authentication)) return ResponseDto.validationFailed();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        if (Objects.isNull(boardNumber)) return null;
        ResponseEntity<? super GetBoardImageUrlsResponseDto> response = fileService.getImageUrlsByBoardNumber(boardNumber, userDetails.getEmail());

        return response;
    }
}
