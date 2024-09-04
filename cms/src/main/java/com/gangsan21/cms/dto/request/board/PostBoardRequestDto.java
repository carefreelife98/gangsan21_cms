package com.gangsan21.cms.dto.request.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostBoardRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private LocalDateTime startDt;

    private LocalDateTime endDt;

    @NotNull // 해당 필드는 필수적으로 존재하나, 빈 배열은 올 수 있도록 허용.
    private List<String> boardImageList;

    @NotNull
    private Integer imageWidth;

    @NotNull
    private Integer imageHeight;

}
