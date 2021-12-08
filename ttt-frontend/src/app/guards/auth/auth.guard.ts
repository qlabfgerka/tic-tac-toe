import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}
  canActivate(): boolean | UrlTree {
    return this.userService.getJWTToken()
      ? true
      : this.router.createUrlTree(['login']);
  }
}
