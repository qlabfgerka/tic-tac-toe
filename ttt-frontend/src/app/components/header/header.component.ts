import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  public logout(): void {
    this.userService.logout();
  }

  public navigateHome(): void {
    this.router.navigate(['']);
  }

  public get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
}
