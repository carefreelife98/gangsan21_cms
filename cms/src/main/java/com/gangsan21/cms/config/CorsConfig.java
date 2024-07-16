package com.gangsan21.cms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // CORS 정책 전부 수용
        registry
                .addMapping("/**")
                .allowedMethods("*")
                .allowedOrigins("*");
    }
}
