import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {}

  public logout(): void {
    this.userService.logout();
  }

  public get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
}
