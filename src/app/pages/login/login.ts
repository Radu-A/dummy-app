import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth-service';

import { TestMessage } from '../../components/test-message/test-message';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TestMessage,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  service = inject(AuthService);
  router = inject(Router);

  // userState = signal<UserStateModel | undefined>(undefined);
  usernameMessage = signal('');
  passwordMessage = signal('');
  loginError = signal<string | null>(null);

  username = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  authForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  // ===============
  // Material docs:
  // ===============
  updateUsernameMessage() {
    if (this.username.hasError('required')) {
      this.usernameMessage.set('You must enter a value');
    } else if (this.username.hasError('minlength')) {
      this.usernameMessage.set('Minimum 3 characters');
    } else {
      this.usernameMessage.set('');
    }
  }
  updatePasswordMessage() {
    if (this.password.hasError('required')) {
      this.passwordMessage.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.passwordMessage.set('Minimum 6 characters');
    } else {
      this.passwordMessage.set('');
    }
  }

  // COMPONENT LOGIC
  // Only render and navigate.
  // API calls and localStorage to service
  handleLogin() {
    if (!this.authForm.valid && !this.authForm.value) return;
    const { username, password } = this.authForm.value;
    this.service.login(username!, password!).subscribe({
      // SUCCESS TRUE: Valid credentials
      next: () => {
        this.loginError.set(null);
        this.router.navigate(['/products']);
      },
      // SUCCESS FALSE: Invalid credentials / Server error
      error: (err) => {
        this.loginError.set(err.error.message);
        console.log('Error: ', err);
      },
    });
  }

  // IMPERATIVE LOGIC:
  // Only render and navigate.
  // API calls and localStorage to service
  // async handleLogin() {
  //   if (this.authForm.valid) {
  //     const { username, password } = this.authForm.value;
  //     const response = await this.service.login(username!, password!);

  //     // SUCCESS TRUE: Valid credentials
  //     if (response.success && response.data) {
  //       this.service.setItem('dummySession', JSON.stringify(response.data));
  //       this.loginError.set(null);
  //       this.router.navigate(['/products']);

  //       // SUCCESS FALSE: Invalid credentials / Server error
  //     } else {
  //       console.log(response.error);
  //       this.loginError.set(response.error);
  //     }
  //   }
  // }
}

// ===============
// DummyJSON docs:
// ===============
// username: 'emilys',
// password: 'emilyspass',
