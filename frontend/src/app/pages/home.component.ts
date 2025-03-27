import { Component } from '@angular/core';
import { UsersComponent } from '../components/users/users.component';

@Component({
  standalone: true,
  imports: [
    UsersComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
