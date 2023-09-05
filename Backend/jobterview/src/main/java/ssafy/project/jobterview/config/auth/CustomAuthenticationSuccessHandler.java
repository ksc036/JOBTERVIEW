package ssafy.project.jobterview.config.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ssafy.project.jobterview.domain.Member;
import ssafy.project.jobterview.service.MemberService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 인증 정보로부터 사용자 정보 추출
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();

        String userNickname = "";
        try {
            Member loginMember = memberService.findByEmail(userEmail);
            userNickname = loginMember.getNickname();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        // 뷰에 전달할 데이터 생성
        Map<String, Object> responseData = new HashMap<>();

        responseData.put("email", userEmail);
        responseData.put("nickname", userNickname);
        responseData.put("roles", roles);
        responseData.put("message", "로그인 성공");

        // 뷰로 데이터 전달
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonData = objectMapper.writeValueAsString(responseData);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(jsonData);
    }
}