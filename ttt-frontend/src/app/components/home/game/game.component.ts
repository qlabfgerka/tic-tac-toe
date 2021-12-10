import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { GameDTO } from 'src/app/models/game/game.model';
import { GameService } from 'src/app/services/game/game.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public isLoading: boolean = true;
  public counter: number = 2;
  public game: GameDTO;
  public isFinished: boolean;
  public winner: string = 'No winners yet.';
  public p1Wins: number = 0;
  public p2Wins: number = 0;

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    this.isLoading = true;
    this.game = this.router.getCurrentNavigation().extras.state.game;
    this.isFinished = false;
    this.isLoading = false;
  }

  ngOnInit(): void {}

  public boardClick(i: number, j: number): void {
    if (this.isFinished) return;

    this.gameService
      .playRound(this.game, i, j)
      .pipe(take(1))
      .subscribe((updated: GameDTO) => {
        this.game = updated;
        if (this.game.boardFull || this.game.winner) {
          if (this.game.winner == this.getUsername) ++this.p1Wins;
          else if (this.game.winner) ++this.p2Wins;
          this.winner = this.game.winner ? this.game.winner : 'DRAW';
          this.isFinished = true;
        }
      });
  }

  public newGame(): void {
    this.isLoading = true;
    this.gameService
      .createGame()
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        this.game = game;
        this.isFinished = false;
        this.isLoading = false;
      });
  }

  public get getUsername(): string {
    return this.userService.getUserID();
  }
}
