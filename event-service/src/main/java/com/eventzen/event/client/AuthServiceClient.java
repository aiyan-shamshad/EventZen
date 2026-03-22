package com.eventzen.event.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "${feign.auth-service.url}")
public interface AuthServiceClient {

    @GetMapping("/api/auth/users/{id}")
    UserDto getUserById(@PathVariable("id") Long id, @RequestHeader("Authorization") String token);

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}
