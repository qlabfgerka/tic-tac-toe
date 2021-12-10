package com.example.tttbackend.controllers.game;

import com.example.tttbackend.model.game.Game;
import com.example.tttbackend.model.game.GameWrapper;
import com.example.tttbackend.model.user.User;
import com.example.tttbackend.service.game.GameService;
import com.example.tttbackend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("{id}")
    public ResponseEntity<Game> getGame(@PathVariable Long id, HttpServletRequest request) {
        return ResponseEntity.ok().body(this.gameService.getGame(id));
    }

    @PostMapping
    public ResponseEntity<Game> createGame(HttpServletRequest request, @RequestBody GameWrapper wrapper) {
        Game game = gameService
                .createGame(JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length())), wrapper.isMultiplayer());
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
                this.gameService.playRound(
                        wrapper.getGame(),
                        wrapper.getI(),
                        wrapper.getJ(),
                        JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length())),
                        false)
        );
    }

    @GetMapping("find")
    public ResponseEntity<Game> findGame(HttpServletRequest request) {
        return ResponseEntity.ok().body(this.gameService
                .findGame(JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length()))));
    }

    @DeleteMapping("{id}")
    public void leaveGame(@PathVariable Long id, HttpServletRequest request) {
        this.gameService.leaveGame(id, JWTUtils.getSubject(request.getHeader(AUTHORIZATION).substring("Bearer ".length())));
    }

    @DeleteMapping("clear/{id}")
    public ResponseEntity<Game> clearGame(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.gameService.clearGame(id, false));
    }

    @MessageMapping("/round/{id}")
    @SendTo("/played/{id}")
    public ResponseEntity<Game> playRoundMP(@DestinationVariable Long id, GameWrapper wrapper, Authentication authentication) {
        if (authentication == null) return new ResponseEntity<>(UNAUTHORIZED);
        String username = authentication.getPrincipal().toString();
        if (username == null) return new ResponseEntity<>(UNAUTHORIZED);

        return ResponseEntity
                .ok()
                .body(this.gameService.playRound(
                        wrapper.getGame(),
                        wrapper.getI(),
                        wrapper.getJ(),
                        username,
                        true));
    }

    @MessageMapping("/clear/{id}")
    @SendTo("/played/{id}")
    public ResponseEntity<Game> clearBoardMP(@DestinationVariable Long id) {
        return ResponseEntity
                .ok()
                .body(this.gameService.clearGame(
                        id,
                        true));
    }
}
