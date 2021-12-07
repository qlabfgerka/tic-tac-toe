package com.example.tttbackend.controllers.user;

import com.example.tttbackend.model.user.User;
import com.example.tttbackend.service.user.UserService;
import com.example.tttbackend.utils.JWTUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.*;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok().body(this.userService.getUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity
                .created(
                        URI.create(ServletUriComponentsBuilder
                                .fromCurrentContextPath().path("/user")
                                .toUriString()))
                .body(this.userService.createUser(user));
    }

    @PostMapping("refreshToken")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String username = JWTUtils.getSubject(authorizationHeader.substring("Bearer ".length()));
                String URL = request.getRequestURL().toString();

                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), JWTUtils.getTokens(username, URL));
            } catch (Exception e) {
                JWTUtils.handleJWTError(response, e.getMessage());
            }
        } else {
            throw new RuntimeException("Refresh token is missing");
        }
    }
}
