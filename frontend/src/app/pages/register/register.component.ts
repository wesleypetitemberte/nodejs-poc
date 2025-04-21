import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user: User = {
    email: '',
    password: '',
    password2: ''
  };

  messageFeedback: string = 'Falha no login!';
  showMessage: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.showMessage = false;

    if (this.user.password !== this.user.password2) {
      this.showMessage = true;
      this.messageFeedback = 'As senhas não coincidem!';
      return;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.showMessage = true;
      this.messageFeedback = 'Email inválido!';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        } else {
          console.error('Token is undefined');
          this.showMessage = true;
          this.messageFeedback = 'Falha no login!';
        }
      },
      error: (err) => {
        console.error(err);
        this.showMessage = true;
        this.messageFeedback = 'Falha no login!';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
