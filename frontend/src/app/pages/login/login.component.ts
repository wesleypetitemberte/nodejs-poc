import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AuthService, User } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user: User = {
    email: '',
    password: ''
  };
  messageFeedback: string = 'Falha no login!';
  showMessage: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.showMessage = false;

    this.authService.login(this.user.email, this.user.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.showMessage = true;
      }
    });
  }
}
