package com.gangsan21.cms.dto.request.scheduler;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchAlarmDto {

    @NotBlank
    private String cron;

}
