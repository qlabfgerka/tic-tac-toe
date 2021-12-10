package com.example.tttbackend.service.game;

import com.example.tttbackend.model.game.Game;
import com.example.tttbackend.model.user.User;
import com.example.tttbackend.repository.game.GameRepository;
import com.example.tttbackend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor    // userRepository inside constructor
@Transactional
@Slf4j
public class GameService implements IGameService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Override
    public Game createGame(String username, boolean type) {
        List<User> users = new ArrayList<>();
        User user = userRepository.findByUsername(username);
        users.add(user);
        if(!type) {
            User AI = new User();
            AI.setUsername("bot");
            users.add(AI);
        }
        Game game = new Game(users, new String[3][3]);
        for (String[] row : game.getBoard()) {
            Arrays.fill(row, "");
        }
        if(type) return gameRepository.save(game);
        return game;
    }

    @Override
    public Game playRoundSP(Game game, int i, int j, String username) {
        if (game.getBoard()[i][j].isEmpty()) {
            String winner;
            game.setRound(i, j, username);

            winner = game.getWinner();

            if (winner != null) {
                User user = userRepository.findByUsername(winner);
                user.setWins(user.getWins() + 1);
                userRepository.save(user);

                return game;
            }

            if (game.isBoardFull()) return game;

            while (true) {
                i = (int) ((Math.random() * (3)));
                j = (int) ((Math.random() * (3)));

                if (game.getBoard()[i][j].isEmpty()) {
                    game.setRound(i, j, "bot");
                    break;
                }
            }
        }

        return game;
    }
}
