package com.gangsan21.cms.dto.response.setting;

import com.gangsan21.cms.common.ResponseCode;
import com.gangsan21.cms.common.ResponseMessage;
import com.gangsan21.cms.dto.response.ResponseDto;
import com.gangsan21.cms.entity.SettingEntity;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class GetSettingResponseDto extends ResponseDto {

    private Long settingNumber;
    private String userEmail;
    private String alarmPeriod;

    private GetSettingResponseDto(SettingEntity setting) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

        this.settingNumber = setting.getSettingNumber();
        this.userEmail = setting.getUserEmail();
        this.alarmPeriod = setting.getAlarmPeriod();
    }

    public static ResponseEntity<? super GetSettingResponseDto> success(SettingEntity setting) {
        GetSettingResponseDto result = new GetSettingResponseDto(setting);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
