package com.example.tttbackend.model.game;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameWrapper {
    private Game game;
    private int i;
    private int j;
    private int player;
}
