import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  titlePage = 'Dashy';
  sidebarOpen = false;
  activePage = 'dashboard';
  selectedLanguage = 'Français';
  
  currentUser = {
    name: 'Amine',
    initials: 'A'
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

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
  }
}
