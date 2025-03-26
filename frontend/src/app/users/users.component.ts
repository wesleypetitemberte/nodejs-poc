import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { UserService, User } from '../services/user.service';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  resetUser: User = {
    name: '',
    lastname: '',
    age: 0
  };
  user: User = this.resetUser;
  editMode: boolean = false;
  editId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  saveUser() {
    if (this.editMode && this.editId !== null) {
      this.userService.updateUser(this.editId, this.user).subscribe(() => {
        this.getUsers();
      });
    } else {
      this.userService.addUser(this.user).subscribe(() => {
        this.getUsers();
      });
    }
    this.user = this.resetUser;
    this.editMode = false;
    this.editId = null;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.editMode = true;
    this.editId = user.id!;
    this.getUsers();
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.getUsers();
    });
  }
}
