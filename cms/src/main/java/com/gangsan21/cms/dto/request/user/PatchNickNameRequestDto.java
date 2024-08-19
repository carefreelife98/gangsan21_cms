package com.gangsan21.cms.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchNickNameRequestDto {

    @NotBlank
    private String nickName;

}
