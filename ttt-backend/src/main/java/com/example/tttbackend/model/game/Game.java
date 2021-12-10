package com.example.tttbackend.model.game;

import com.example.tttbackend.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "game")
@Data
@AllArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToMany(targetEntity = User.class)
    @JoinColumn(name = "id")
    private List<User> players;

    private String[][] board;

    public Game(List<User> players, String[][] board) {
        this.players = players;
        this.board = board;
    }

    public void setRound(int i, int j, String username) {
        board[i][j] = username;
    }

    public void addPlayer(User user) {
        players.add(user);
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
