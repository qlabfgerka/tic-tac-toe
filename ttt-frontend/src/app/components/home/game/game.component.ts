import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { GameDTO } from 'src/app/models/game/game.model';
import { GameService } from 'src/app/services/game/game.service';
import { UserService } from 'src/app/services/user/user.service';
import { Message } from '@stomp/stompjs';
import { UserDTO } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  public game: GameDTO;
  public isFinished: boolean;
  public singleplayer: boolean;
  public isLoading: boolean = true;
  public winner: string = 'No winners yet.';
  public p1Wins: number = 0;
  public p2Wins: number = 0;

  private playedSubscription: Subscription;
  private clearedSubscription: Subscription;

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly rxStompService: RxStompService
  ) {
    this.singleplayer =
      this.router.getCurrentNavigation().extras.state.singlePlayer;
  }

  ngOnInit(): void {
    this.refreshGame();
  }

  ngOnDestroy(): void {
    if (this.playedSubscription) this.playedSubscription.unsubscribe();
    if (this.clearedSubscription) this.clearedSubscription.unsubscribe();

    this.gameService
      .leaveGame(this.game.id)
      .pipe(take(1))
      .subscribe(() => {});
  }

  public boardClick(i: number, j: number): void {
    console.log(this.isFinished);
    console.log(this.game.players.length);
    console.log(this.turn);
    if (this.isFinished) return;
    if (this.game.players.length === 1) return;
    if (!this.turn) return;
    if (this.singleplayer) {
      this.gameService
        .playRound(this.game, i, j)
        .pipe(take(1))
        .subscribe((updated: GameDTO) => {
          this.handleGame(updated);
        });
    } else {
      console.log('hi');
      this.rxStompService.publish({
        destination: `/round/${this.game.id}`,
        body: JSON.stringify({ game: this.game, i, j }),
        headers: { Authorization: this.userService.getJWTToken() },
      });
    }
  }

  public newGame(): void {
    if (this.singleplayer) {
      this.isLoading = true;
      this.gameService
        .clearGame(this.game.id)
        .pipe(take(1))
        .subscribe((game: GameDTO) => {
          this.game = game;
          this.isFinished = false;
          this.isLoading = false;
        });
    } else {
      this.rxStompService.publish({
        destination: `/clear/${this.game.id}`,
        headers: { Authorization: this.userService.getJWTToken() },
      });
    }
  }

  public get turn(): boolean {
    if (this.game.turn > this.game.players.length - 1) return false;
    return this.getUsername === this.game.players[this.game.turn].username;
  }

  public get getUsername(): string {
    return this.userService.getUserID();
  }

  public get getOpponentUsername(): string {
    if (this.game.players.length === 1) return 'WAITING';
    return this.game.players
      .filter((player: UserDTO) => player.username !== this.getUsername)[0]
      .username.toUpperCase();
  }

  public get getOpponentUsernameTable(): string {
    if (this.game.players.length === 1) return 'WAITING';
    return `${this.getOpponentUsername}'S WINS`;
  }

  private refreshGame(): void {
    this.isFinished = false;
    this.isLoading = true;
    this.route.paramMap
      .pipe(
        take(1),
        mergeMap((paramMap) => {
          return this.gameService.getGame(paramMap.get('id')).pipe(take(1));
        })
      )
      .subscribe((game: GameDTO) => {
        this.game = game;
        this.isLoading = false;
        console.log(this.game);

        if (this.singleplayer) return;

        this.playedSubscription = this.rxStompService
          .watch(`/played/${this.game.id}`)
          .subscribe((message: Message) => {
            this.handleGame(JSON.parse(message.body).body);
          });
      });
  }

  private handleGame(updated: GameDTO): void {
    this.isLoading = true;
    this.game = updated;
    if (
      (this.game.boardFull !== null && this.game.boardFull) ||
      this.game.winner
    ) {
      if (this.game.winner == this.getUsername) ++this.p1Wins;
      else if (this.game.winner) ++this.p2Wins;
      this.winner = this.game.winner ? this.game.winner : 'DRAW';
      this.isFinished = true;
    } else this.isFinished = false;
    this.isLoading = false;
  }
}
