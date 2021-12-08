import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {}

  public login(username: string, password: string): Observable<TokenDTO> {
    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    let options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    return this.httpClient.post<TokenDTO>(
      `${this.hostname}/users/login`,
      body.toString(),
      options
    );
  }

  public register(user: UserDTO): Observable<UserDTO> {
    return this.httpClient.post<UserDTO>(`${this.hostname}/users`, user);
  }

  public refreshToken(): Observable<TokenDTO> {
    return this.httpClient
      .post<TokenDTO>(
        `${this.hostname}/users/refreshToken`,
        this.getRefreshToken()
      )
      .pipe(
        tap((tokens: TokenDTO) => {
          this.saveTokens(tokens);
        })
      );
  }

  public logout(): void {
    this.deleteTokens();
    this.router.navigate(['login']);
  }

  public saveTokens(tokens: TokenDTO): boolean {
    localStorage.setItem('JWT_TOKEN', tokens.accessToken);
    localStorage.setItem('REFRESH_TOKEN', tokens.refreshToken);

    return true;
  }

  public getJWTToken(): string {
    return localStorage.getItem('JWT_TOKEN');
  }

  public getRefreshToken(): string {
    return localStorage.getItem('REFRESH_TOKEN');
  }

  public deleteTokens(): void {
    localStorage.clear();
  }

  public getUserID(): string {
    return JSON.parse(atob(this.getJWTToken().split('.')[1])).sub;
  }

  public getUsers(): Observable<Array<UserDTO>> {
    return this.httpClient.get<Array<UserDTO>>(`${this.hostname}/users`);
  }

  public get isLoggedIn(): boolean {
    return this.getJWTToken() !== '';
  }
}
