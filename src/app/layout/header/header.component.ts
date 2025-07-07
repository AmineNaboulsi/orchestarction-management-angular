import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageService } from '../../shared/services/lang/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, FormsModule, MatIconModule, MatDividerModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit{
  @Input() profile: KeycloakProfile  | null = null;
  @Output() logout = new EventEmitter<void>();
  supportedLanguages: any[] = [];
  currentLanguage: string = 'en';
  private languageSubscription: Subscription = new Subscription();
  isDropdownOpen = false;

  constructor(private router: Router,private languageService: LanguageService) {}
  
  ngOnInit(): void {
     this.supportedLanguages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();
    
    // Subscribe to language changes
    this.languageSubscription = this.languageService.getCurrentLanguage$().subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );
  }

  ngOnDestroy() {
    this.languageSubscription.unsubscribe();
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.languageService.changeLanguage(target.value)
        .then(() => {
          console.log('Language changed successfully');
        })
        .catch((error) => {
          console.error('Error changing language:', error);
        });
    }
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

  getCompanyId(): string {
    const companyId = this.profile?.attributes?.['companyId'];
    return Array.isArray(companyId) ? companyId[0] : (companyId as string) || 'No company ID';
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