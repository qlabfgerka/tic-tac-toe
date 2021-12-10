import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameDTO } from 'src/app/models/game/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public playRound(game: GameDTO, i: number, j: number): Observable<GameDTO> {
    return this.httpClient.post<GameDTO>(`${this.hostname}/game/round`, {
      game,
      i,
      j,
    });
  }

  public createGame(): Observable<GameDTO> {
    return this.httpClient.post<GameDTO>(`${this.hostname}/game`, {});
  }
}
