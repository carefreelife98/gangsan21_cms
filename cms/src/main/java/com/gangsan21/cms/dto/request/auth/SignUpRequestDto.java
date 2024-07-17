package com.gangsan21.cms.dto.request.auth;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.NonNull;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @Email
    @NotBlank // null, 빈 문자열, 공백 문자열 불가
    private String email;

    @NotBlank @Size(min=8, max = 20)
    private String password;

    @NotBlank
    private String nickName;

    @NotBlank @Pattern(regexp = "^[0-9]{11,13}$") // 0~9 숫자로 이루어진 11~13 길이 문자열
    private String telNumber;

    @NotBlank
    private String address;

    private String addressDetail;

    @NotNull // @NotBlank (String Only) 와 다르게 모든 객체형 타입에 사용 가능.
    @AssertTrue // 무조건 true 여야 받을 수 있음.
    private Boolean agreedPersonal;
}
