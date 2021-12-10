package com.example.tttbackend.controllers.game;

import com.example.tttbackend.model.game.Game;
import com.example.tttbackend.model.game.GameWrapper;
import com.example.tttbackend.model.user.User;
import com.example.tttbackend.service.game.GameService;
import com.example.tttbackend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;

import java.net.URI;
import java.security.Principal;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Slf4j
public class GameController {
    private final GameService gameService;

    @PostMapping
    public ResponseEntity<Game> createGame(HttpServletRequest request) {
        Game game = gameService
                .createGame(JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length())), false);
        return ResponseEntity
                .created(
                        URI.create(ServletUriComponentsBuilder
                                .fromCurrentContextPath().path("/game")
                                .toUriString()))
                .body(game);
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

    @PostMapping("multiplayer")
    public ResponseEntity<Game> createGameMP(HttpServletRequest request) {
        Game game = gameService
                .createGame(JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length())), true);
        return ResponseEntity
                .created(
                        URI.create(ServletUriComponentsBuilder
                                .fromCurrentContextPath().path("/game")
                                .toUriString()))
                .body(game);
    }
    /*@MessageMapping("/hello")
    @SendTo("/topic/test")
    public ResponseEntity<Game> createGameMP(Authentication authentication) {
        if (authentication == null) return new ResponseEntity<>(UNAUTHORIZED);
        log.info("USER {}", authentication.getPrincipal());
        String username = authentication.getPrincipal().toString();
        if (username == null) return new ResponseEntity<>(UNAUTHORIZED);
        return ResponseEntity
                .created(URI.create("localhost:3000/game/hello"))
                .body(this.gameService.createGame(username, true));
    }*/

    public void joinGame(Authentication authentication) {

    }
}
