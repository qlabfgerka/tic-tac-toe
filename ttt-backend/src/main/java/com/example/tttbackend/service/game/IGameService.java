package com.example.tttbackend.service.game;

import com.example.tttbackend.model.game.Game;

public interface IGameService {
    Game createGameSP(String username);
    Game playRoundSP(Game game, int i, int j, String username);
}
