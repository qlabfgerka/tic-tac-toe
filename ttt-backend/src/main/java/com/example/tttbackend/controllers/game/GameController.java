package com.example.tttbackend.controllers.game;

import com.example.tttbackend.model.game.Game;
import com.example.tttbackend.model.game.GameWrapper;
import com.example.tttbackend.service.game.GameService;
import com.example.tttbackend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;

import java.net.URI;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Slf4j
public class GameController {
    private final GameService gameService;

    @PostMapping
    public ResponseEntity<Game> createGame(HttpServletRequest request) {
        return ResponseEntity
                .created(
                        URI.create(ServletUriComponentsBuilder
                                .fromCurrentContextPath().path("/game")
                                .toUriString()))
                .body(this.gameService.createGameSP(
                        JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length()))));
    }

    @PostMapping("round")
    public ResponseEntity<Game> playRound(@RequestBody GameWrapper wrapper, HttpServletRequest request) {
        return ResponseEntity.ok().body(
                this.gameService.playRoundSP(
                        wrapper.getGame(),
                        wrapper.getI(),
                        wrapper.getJ(),
                        JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length()))));
    }
}
