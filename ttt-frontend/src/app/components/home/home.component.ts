import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly rxStompService: RxStompService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {}

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

  public joinGame(): void {
    this.gameService
      .joinGame()
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        this.rxStompService.publish({
          destination: `/clear/${game.id}`,
          headers: { Authorization: this.userService.getJWTToken() },
        });
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
}
