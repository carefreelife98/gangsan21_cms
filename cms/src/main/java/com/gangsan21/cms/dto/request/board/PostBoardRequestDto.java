package com.gangsan21.cms.dto.request.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostBoardRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull // 해당 필드는 필수적으로 존재하나, 빈 배열은 올 수 있도록 허용.
    private List<String> boardImageList;

}
