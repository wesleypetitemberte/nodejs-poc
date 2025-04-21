import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AuthService, User } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  user!: User;
  code: string = '';
  messageFeedback: string = 'Erro ao enviar email de recuperação!';
  showMessage: boolean = false;

  constructor(private authService: AuthService) {}

  forgotPassword() {
    this.showMessage = false;

    this.authService.forgotPassword(this.user.email).subscribe({
      next: (res) => {
        console.log(res);
        this.showMessage = true;
        this.messageFeedback = 'Email de recuperação enviado com sucesso!';

        this.code = this.user.code = '12345';
      },
      error: (err) => {
        console.error(err);
        this.showMessage = true;
        this.messageFeedback = 'Erro ao enviar email de recuperação!';
      }
    });
  }
}
