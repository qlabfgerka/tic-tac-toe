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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor    // userRepository inside constructor
@Transactional
@Slf4j
public class GameService implements IGameService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Override
    public List<Game> getGames() {
        return gameRepository.findAll();
    }

    @Override
    public Game getGame(Long id) {
        return gameRepository.getById(id);
    }

    @Override
    public Game createGame(String username, boolean type) {
        Game game = new Game();
        List<User> users = new ArrayList<>();
        User user = userRepository.findByUsername(username);
        users.add(user);
        if (!type) {
            User AI = userRepository.findByUsername("bot");
            users.add(AI);
        }
        game.setPlayers(users);
        game.setBoard(new String[3][3]);
        for (String[] row : game.getBoard()) {
            Arrays.fill(row, "");
        }

        if (type) game.setTurn((int) Math.round(Math.random()));
        return gameRepository.save(game);
    }

    @Override
    public Game playRound(Game g, int i, int j, String username, boolean type) {
        Game game = gameRepository.getById(g.getId());
        if (game.getBoard()[i][j].isEmpty()) {
            String winner;
            game.setRound(i, j, username);

            if (type) game.setTurn(game.getTurn() == 0 ? 1 : 0);

            winner = game.getWinner();

            if (winner != null) {
                User user = userRepository.findByUsername(winner);
                user.setWins(user.getWins() + 1);
                userRepository.save(user);

                return game;
            }

            if (game.isBoardFull()) return game;

            if (!type) {
                while (true) {
                    i = (int) ((Math.random() * (3)));
                    j = (int) ((Math.random() * (3)));

                    if (game.getBoard()[i][j].isEmpty()) {
                        game.setRound(i, j, "bot");
                        break;
                    }
                }
            }
        }

        return game;
    }

    @Override
    public Game findGame(String username) {
        User user = userRepository.findByUsername(username);
        List<Game> game = gameRepository
                .findAll()
                .stream()
                .filter(g -> g.getPlayers().size() == 1)
                .collect(Collectors.toList());
        if (game.get(game.size() - 1).getPlayers().get(0) == user) return game.get(game.size() - 1);
        game.get(game.size() - 1).addPlayer(user);
        return gameRepository.save(game.get(game.size() - 1));
    }

    @Override
    public Game joinGame(Long id, String username) {
        Game game = gameRepository.getById(id);
        User user = userRepository.findByUsername(username);
        game.addPlayer(user);
        return gameRepository.save(game);
    }

    @Override
    public Game clearGame(Long id, boolean type) {
        Game game = gameRepository.getById(id);
        game.setBoard(new String[3][3]);
        for (String[] row : game.getBoard()) {
            Arrays.fill(row, "");
        }
        if (type) game.setTurn((int) Math.round(Math.random()));

        return game;
    }

    @Override
    public void leaveGame(Long id, String username) {
        Game game = gameRepository.getById(id);
        if(!game.removePlayer(userRepository.findByUsername(username))) return;
        if(game.getPlayers().size() > 0) return;
        gameRepository.delete(gameRepository.getById(id));
    }
}
