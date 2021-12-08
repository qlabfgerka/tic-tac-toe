import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public error: string;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat: ['', [Validators.required]],
    });
  }

  public register(): void {
    this.error = '';
    if (this.registerForm.valid) {
      if (
        this.registerForm.get('password').value !==
        this.registerForm.get('repeat').value
      ) {
        this.error = 'Passwords do not match';
        this.registerForm.get('repeat').setErrors({ incorrect: true });
        return;
      }

      const user: UserDTO = {
        username: this.registerForm.get('username').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        nickname: '',
        wins: 0,
      };

      this.userService
        .register(user)
        .pipe(
          take(1),
          mergeMap(() => this.userService.login(user.username, user.password)),
          catchError((error) => throwError(error))
        )
        .subscribe(
          (tokens: TokenDTO) => {
            this.userService.saveTokens(tokens);

            this.router.navigate(['']);
          },
          (error) => {
            this.error = error.error.error;
            this.registerForm.setErrors({ incorrect: true });
          }
        );
    }
  }

  public get errorControl() {
    return this.registerForm.controls;
  }
}
