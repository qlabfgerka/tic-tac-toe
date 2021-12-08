import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { GameDTO } from 'src/app/models/game/game.model';
import { SingleplayerService } from 'src/app/services/game/singleplayer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly spService: SingleplayerService
  ) {}

  ngOnInit(): void {}

  public singlePlayer(): void {
    this.spService
      .createGame()
      .pipe(take(1))
      .subscribe((game: GameDTO) => {
        const navigationExtras: NavigationExtras = {
          state: {
            game: game,
          },
        };
        this.router.navigate(['game'], navigationExtras);
      });
  }

  public multiPlayer(): void {}
}
