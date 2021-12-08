import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {}

  test(): void {
    this.userService
      .getUsers()
      .pipe(take(1))
      .subscribe((users: Array<UserDTO>) => {
        console.log(users);
      });
  }
}
