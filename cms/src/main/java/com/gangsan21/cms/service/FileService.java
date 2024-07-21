package com.gangsan21.cms.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    // File 을 받아온 후 해당 File 에 접근할 수 있는 url 로 반환.
    String upload(MultipartFile file) throws IOException;

    // url 을 통해 이미지 리소스를 반환
    Resource getImage(String fileName);

}
