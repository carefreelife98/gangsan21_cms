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
public class PatchBoardRequestDto {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private LocalDateTime startDt;

    private LocalDateTime endDt;

    @NotNull
    private List<String> boardImageList;

    @NotNull
    private Integer imageWidth;

    @NotNull
    private Integer imageHeight;
}
