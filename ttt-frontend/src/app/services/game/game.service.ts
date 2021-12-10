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

  public getGame(id: string): Observable<GameDTO> {
    return this.httpClient.get<GameDTO>(`${this.hostname}/game/${id}`);
  }

  public playRound(game: GameDTO, i: number, j: number): Observable<GameDTO> {
    return this.httpClient.post<GameDTO>(`${this.hostname}/game/round`, {
      game,
      i,
      j,
    });
  }

  public createGame(multiplayer: boolean): Observable<GameDTO> {
    return this.httpClient.post<GameDTO>(`${this.hostname}/game`, {
      multiplayer,
    });
  }

  public leaveGame(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.hostname}/game/${id}`);
  }

  public clearGame(id: number): Observable<GameDTO> {
    return this.httpClient.delete<GameDTO>(`${this.hostname}/game/clear/${id}`);
  }

  public joinGame(): Observable<GameDTO> {
    return this.httpClient.get<GameDTO>(`${this.hostname}/game/find`);
  }
}
