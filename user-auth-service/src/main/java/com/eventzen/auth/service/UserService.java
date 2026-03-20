package com.eventzen.auth.service;

import com.eventzen.auth.dto.*;
import com.eventzen.auth.mapper.UserMapper;
import com.eventzen.auth.model.Role;
import com.eventzen.auth.model.User;
import com.eventzen.auth.repository.UserRepository;
import com.eventzen.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    /**
     * Register a new user.
     */
    public UserResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // Build user entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ATTENDEE) // Default role
                .build();

        // Save to database
        User savedUser = userRepository.save(user);

        // Return DTO (no password)
        return userMapper.toResponse(savedUser);
    }

    /**
     * Login and return JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }

    /**
     * Get current user profile.
     */
    public UserResponse getCurrentUser(User user) {
        return userMapper.toResponse(user);
    }

    /**
     * Get user by ID.
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    /**
     * Get all users (admin only).
     */
    public List<UserResponse> getAllUsers() {
        return userMapper.toResponseList(userRepository.findAll());
    }

    /**
     * Update user role (admin only).
     */
    public UserResponse updateUserRole(Long id, UpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setRole(request.getRole());
        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    /**
     * Delete user (admin only).
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
