import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[MatIconModule, RouterModule, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SidebarComponent {

  @Output() closeBergerMenu = new EventEmitter<boolean>()

  items = [
    {
      routelink: '/',
      icon: 'home',
      label: 'Home',
    },
    {
      routelink: '/tasks',
      icon: 'task',
      label: 'Tasks',
    },
    {
      routelink: '/process',
      icon: 'settings',
      label: 'Process',
    },
  ];

  Close(){
    this.closeBergerMenu.emit(false);
  }
}
