package com.example.Buyzon.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String role
) {
}
