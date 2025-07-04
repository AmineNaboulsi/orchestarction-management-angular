import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.keycloak.isLoggedIn();
  }

  // Get user profile
  getUserProfile(): Observable<any> {
    return from(this.keycloak.loadUserProfile());
  }

  // Get user roles
  getUserRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  // Get username
  getUsername(): string {
    return this.keycloak.getUsername();
  }

  // Get access token
//   getToken(): string {
//     return this.keycloak.getToken();
//   }

  // Login
  login(): Observable<void> {
    return from(this.keycloak.login());
  }

  // Logout
  logout(): Observable<void> {
    return from(this.keycloak.logout(window.location.origin));
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.keycloak.isUserInRole(role));
  }

  // Update token
  updateToken(minValidity: number = 30): Observable<boolean> {
    return from(this.keycloak.updateToken(minValidity));
  }
}