package com.gangsan21.cms.service.impl;

import com.gangsan21.cms.service.FileService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

//    @Value("{image-file.path")
    private String filePath;
    @Value("${image-file.url}")
    private String fileUrl;


    @Override
    public String upload(MultipartFile file) throws IOException {

        if (file.isEmpty()) return null;

        String orginalFileName = file.getOriginalFilename();
        // 확장자
        String extension = orginalFileName.substring(orginalFileName.lastIndexOf("."));
        // 랜덤 UUID 생성
        String uuid = UUID.randomUUID().toString();
        // 새로운 파일명
        String saveFileName = uuid + extension;

        String savePath = filePath + saveFileName;

        try {
            file.transferTo(new File(savePath));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return fileUrl + saveFileName;
    }

    @Override
    public Resource getImage(String fileName) {

        Resource resource = null;

        try {
            resource = new UrlResource("file:" + filePath + fileName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return resource;
    }

    // file path 미리 정의.
    @PostConstruct
    public void setFilePath() throws IOException {
        // 운영체제에 따라 파일 경로 설정
        String os = System.getProperty("os.name").toLowerCase();
//        String filePath;

        if (os.contains("win")) {
            // Windows 경로
            filePath = "C:\\Users\\gangsan21\\uploads\\";
        } else if (os.contains("mac")) {
            // Mac OS 경로
            filePath = "/Users/carefreelife/cms-uploads/";
        } else {
            // 기타 Unix 계열 시스템 경로
            filePath = "/tmp/uploads/";
        }

        try {
            // 디렉토리가 존재하지 않으면 생성
            if (!Files.exists(Path.of(filePath))) {
                Files.createDirectories(Path.of(filePath));
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }
}
