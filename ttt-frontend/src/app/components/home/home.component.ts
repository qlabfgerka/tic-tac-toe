import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { take } from 'rxjs/operators';
import { GameDTO } from 'src/app/models/game/game.model';
import { GameService } from 'src/app/services/game/game.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public games: Array<GameDTO>;
  public displayedColumns: string[] = ['title', 'players', 'join'];
  public dataSource: MatTableDataSource<GameDTO>;
  public interval: ReturnType<typeof setInterval>;

  constructor(
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly rxStompService: RxStompService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.refreshGames();
    this.interval = setInterval(() => {
      this.refreshGames();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  public singlePlayer(): void {
    this.gameService
      .createGame(false)
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        this.handleRedirect(game, true);
      });
  }

  public multiPlayer(): void {
    this.gameService
      .createGame(true)
      .pipe(take(1))
      .subscribe((game: GameDTO) => this.handleRedirect(game, false));
  }

  public findGame(): void {
    this.gameService
      .findGame()
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        this.handleJoin(game);
        this.handleRedirect(game, false);
      });
  }

  public joinGame(id: number): void {
    this.gameService
      .joinGame(id)
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        this.handleJoin(game);
        this.handleRedirect(game, false);
      });
  }

  private handleRedirect(game: GameDTO, singlePlayer: boolean): void {
    const navigationExtras: NavigationExtras = {
      state: {
        singlePlayer,
      },
    };
    this.router.navigate([`game/${game.id}`], navigationExtras);
  }

  private handleJoin(game: GameDTO): void {
    this.rxStompService.publish({
      destination: `/clear/${game.id}`,
      headers: { Authorization: this.userService.getJWTToken() },
    });
  }

  private refreshGames(): void {
    this.gameService
      .getGames()
      .pipe(take(1))
      .subscribe((games: Array<GameDTO>) => {
        this.games = games;
        this.dataSource = new MatTableDataSource(this.games);
      });
  }
}
