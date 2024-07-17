package com.gangsan21.cms.util.encryption;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class StringEncryptorUtil {

    // spring security 라이브러리 사용
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String encodeString(String str) {
        return passwordEncoder.encode(str);
    }
    public boolean isMatched (String origin, String encoded) {
        return passwordEncoder.matches(origin, encoded);
    }

}
