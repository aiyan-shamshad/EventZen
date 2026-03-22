package com.eventzen.event.service;

import com.eventzen.event.client.AuthServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthProxy {

    private final AuthServiceClient authServiceClient;

    @CircuitBreaker(name = "authService", fallbackMethod = "fallbackGetUserById")
    public AuthServiceClient.UserDto getUserById(Long id, String token) {
        return authServiceClient.getUserById(id, token);
    }

    public AuthServiceClient.UserDto fallbackGetUserById(Long id, String token, Throwable t) {
        log.error("Circuit Breaker triggered for Auth Service (id={}): {}", id, t.getMessage());
        return new AuthServiceClient.UserDto(id, "Unavailable (Auth Service Down)", "unknown", "unknown");
    }
}
