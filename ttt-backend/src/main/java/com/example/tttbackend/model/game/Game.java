package com.example.tttbackend.model.game;

import com.example.tttbackend.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Game {
    private List<User> players;
    private String[][] board;

    public void setRound(int i, int j, String username) {
        board[i][j] = username;
    }

    public String getWinner() {
        int vertical, horizontal;
        for (User player : players) {
            for (int j = 0; j < 3; j++) {
                vertical = 0;
                horizontal = 0;
                for (int k = 0; k < 3; k++) {
                    if (board[j][k].equals(player.getUsername())) {
                        horizontal++;
                    }
                    if (board[k][j].equals(player.getUsername())) {
                        vertical++;
                    }
                }

                if (horizontal == 3 || vertical == 3) return player.getUsername();
            }
            if ((board[0][0].equals(player.getUsername()) &&
                    board[1][1].equals(player.getUsername()) &&
                    board[2][2].equals(player.getUsername())) ||
                    (board[0][2].equals(player.getUsername()) &&
                            board[1][1].equals(player.getUsername()) &&
                            board[2][0].equals(player.getUsername()))
            ) return player.getUsername();
        }

        return null;
    }

    public Boolean isBoardFull() {
        for (int j = 0; j < 3; j++) {
            for (int k = 0; k < 3; k++) {
                if (board[j][k].isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }
}
