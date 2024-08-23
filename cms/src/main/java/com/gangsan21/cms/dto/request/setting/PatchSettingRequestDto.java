package com.gangsan21.cms.dto.request.setting;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchSettingRequestDto {

    @NotBlank
    private String cron;

}
