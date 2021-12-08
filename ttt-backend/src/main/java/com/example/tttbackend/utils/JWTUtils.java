package com.example.tttbackend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class JWTUtils {
    public static final String secret = "ASubWIGWAGWq7w8zrGFS/(QG7qwr";
    private static final Algorithm algorithm = Algorithm.HMAC256(secret.getBytes(StandardCharsets.UTF_8));

    public static final int accessTokenExpiration = 10 * 60 * 1000;
    public static final int refreshTokenExpiration = 60 * 1000 * 60 * 24 * 7;

    public static String signToken(String username, String URL, int exp) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + exp))
                .withIssuer(URL)
                .sign(algorithm);
    }

    public static DecodedJWT decodeJWT(String token) {
        Algorithm algorithm = Algorithm.HMAC256(JWTUtils.secret.getBytes(StandardCharsets.UTF_8));
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public static String getSubject(String token) {
        return decodeJWT(token).getSubject();
    }

    public static Map<String, String> getTokens(String username, String URL) {
        Map<String, String> tokens = new HashMap<>();
        String accessToken = JWTUtils.signToken(username, URL, accessTokenExpiration);
        String refreshToken = JWTUtils.signToken(username, URL, refreshTokenExpiration);
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    public static Map<String, String> setMap(String title, String message) {
        Map<String, String> map = new HashMap<>();
        map.put(title, message);
        return map;
    }

    public static void handleJWTError(HttpServletResponse response, String message, int status) throws IOException {
        response.setHeader("error", message);
        response.setStatus(status);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), JWTUtils.setMap("errorMessage", message));
    }
}
