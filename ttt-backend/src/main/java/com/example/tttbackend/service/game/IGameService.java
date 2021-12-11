package com.example.tttbackend.service.game;

import com.example.tttbackend.model.game.Game;

import java.util.List;

public interface IGameService {
    List<Game> getGames();

    Game getGame(Long id);

    Game createGame(String username, boolean type);

    Game playRound(Game g, int i, int j, String username, boolean type);

    Game findGame(String username);

    Game joinGame(Long id, String username);

    Game clearGame(Long id, boolean type);

    void leaveGame(Long id, String username);
}
