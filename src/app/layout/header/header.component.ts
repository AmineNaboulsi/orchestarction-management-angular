import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, FormsModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() profile: KeycloakProfile | null = null;
  @Output() logout = new EventEmitter<void>();

  selectedLanguage = 'fr';
  isDropdownOpen = false;

  constructor(private router: Router) {}

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    // this is where after teh support langaue i need to make the implementation of  @ngx-translate/core in 
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getUserInitial(): string {
    if (this.profile?.firstName) {
      return this.profile.firstName.charAt(0).toUpperCase();
    }
    return this.profile?.username?.charAt(0).toUpperCase() || 'U';
  }

  getUsername(): string {
    return this.profile?.username || this.profile?.firstName || 'User';
  }

  getUserEmail(): string {
    return this.profile?.email || 'No email';
  }

  onLogout() {
    this.isDropdownOpen = false;
    this.logout.emit();
  }

  navigateToProfile() {
    this.isDropdownOpen = false;
    this.router.navigate(['/profile/my-profile']);
  }
}