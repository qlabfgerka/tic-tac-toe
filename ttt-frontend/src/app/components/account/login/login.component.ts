import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error: string;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public login(): void {
    this.error = '';
    if (this.loginForm.valid) {
      this.userService
        .login(
          this.loginForm.get('username').value,
          this.loginForm.get('password').value
        )
        .pipe(take(1))
        .subscribe(
          (tokens: TokenDTO) => {
            this.userService.saveTokens(tokens);

            this.router.navigate(['']);
          },
          (error) => {
            this.error = error.error.error;
          }
        );
    }
  }

  public get errorControl() {
    return this.loginForm.controls;
  }
}
