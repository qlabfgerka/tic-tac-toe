package com.example.tttbackend.repository.game;

import com.example.tttbackend.model.game.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
