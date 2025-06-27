import { Component, OnInit } from '@angular/core';
import { ApiResponseListTaskDto, ApiResponsePagedResultTaskDto, PagedResultProcessDto, PagedResultTaskDto, ProcessBpmApiService, TaskBpmApiService } from '../../api-client';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tickets',
  imports: [NgFor],
  providers: [TaskBpmApiService],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tasks: PagedResultTaskDto | undefined;
  constructor(private ticketsApi: TaskBpmApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.ticketsApi.searchTasks("a","a",
      {
        size: 10,
        page: 0,
        sort: "ASC",
        filter: {}}
    ).subscribe({
      next: (response) => {
        this.tasks = response.body; 
      },
      error: (err) => {
        console.error('Error loading processes', err);
      }
    });
  }

  complete(id: string | undefined) {
    //
    console.log(id)
  }

}