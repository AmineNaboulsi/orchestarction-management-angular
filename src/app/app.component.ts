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
  
  // User info - you can replace with actual user data
  currentUser = {
    name: 'mvp',
    initials: 'M'
  };
  
  // Language selection
  selectedLanguage = 'Français';
  
  // Navigation items
  navItems = [
    { name: 'Produits', active: true },
    { name: 'Tickets', active: false },
    { name: 'Utilisateurs', active: false }
  ];
  
  onLanguageChange(language: string) {
    this.selectedLanguage = language;
  }
  
  onNavItemClick(item: any) {
    this.navItems.forEach(navItem => navItem.active = false);
    item.active = true;
  }

}
