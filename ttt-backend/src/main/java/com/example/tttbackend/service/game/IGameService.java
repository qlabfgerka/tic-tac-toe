package com.example.tttbackend.service.game;

import com.example.tttbackend.model.game.Game;

public interface IGameService {
    Game createGame(String username, boolean type);
    Game playRoundSP(Game game, int i, int j, String username);
}
