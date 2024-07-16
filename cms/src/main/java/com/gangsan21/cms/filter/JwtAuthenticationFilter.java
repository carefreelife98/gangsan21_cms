package com.gangsan21.cms.filter;

import com.gangsan21.cms.provider.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.util.StringUtil;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor // 필수 멤버 변수의 생성자를 만듦. (final 사용 시 필수 멤버 변수가 됨)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
// get JWT Bearer Token
            String token = parseBearerToken(request);

            // email 을 활용한 검증 및 email 정보 반환
            String email = jwtProvider.validateJwt(token);

            // token 이 만료/미발급 되거나 email 정보가 없는 경우 필터링 및 반환
            if (Objects.isNull(token) || Objects.isNull(email)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Email 을 활용한 Authentication Token 설정
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);

            // 인증 요청에 대한 세부 정보 설정 (웹 인증 세부 정보)
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Security 컨텍스트 설정
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authenticationToken);

            SecurityContextHolder.setContext(securityContext);
        } catch (Exception e) {
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    // HTTP Header 에서 Authorization 필드를 뽑아 Bearer 방식인지 확인하는 메서드.
    private String parseBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");

        boolean hasAuthorization = StringUtils.hasText(authorization);
        boolean isBearer = authorization.startsWith("Bearer ");

        if (!hasAuthorization || !isBearer) return null;

        return authorization.substring(7);
    }
}
