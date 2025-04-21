import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  selector: 'app-tasks',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  resetTask: Task = {
    customer: '',
    name: '',
    description: '',
    price: 0
  };
  task: Task = this.resetTask;
  editMode: boolean = false;
  editId: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  saveTask() {
    if (this.editMode && this.editId !== null) {
      this.taskService.updateTask(this.editId, this.task).subscribe(() => {
        this.getTasks();
      });
    } else {
      this.taskService.addTask(this.task).subscribe(() => {
        this.getTasks();
      });
    }
    this.task = this.resetTask;
    this.editMode = false;
    this.editId = null;
  }

  editTask(task: Task) {
    this.task = { ...task };
    this.editMode = true;
    this.editId = task.id!;
    this.getTasks();
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.getTasks();
    });
  }
}
