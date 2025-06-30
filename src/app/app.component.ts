import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  titlePage = 'Dashy';
  sidebarOpen = true;
  activePage = 'dashboard';
  selectedLanguage = 'Français';
  
  
  // User info
  currentUser = {
    name: 'mvp',
    initials: 'M'
  };
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActivePage(page: string) {
    this.activePage = page;
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  // Navigation items
  navItems = [
    { name: 'Home', active: true },
    { name: 'Process', active: false },
    { name: 'Tickets', active: false }
  ];
  
  onLanguageChange(language: string) {
    this.selectedLanguage = language;
  }
  
  onNavItemClick(item: any) {
    this.navItems.forEach(navItem => navItem.active = false);
    item.active = true;
  }
}
