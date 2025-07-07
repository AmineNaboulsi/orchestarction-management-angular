import { Injectable } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private profileSubject = new BehaviorSubject<KeycloakProfile | null>(null);

  setProfile(profile: KeycloakProfile | null) {
    this.profileSubject.next(profile);
  }

  getProfile(): Observable<KeycloakProfile | null> {
    return this.profileSubject.asObservable();
  }

   getCompanyId(): string {
    const companyId = this.profileSubject.value?.attributes?.['companyId'];
    return Array.isArray(companyId) ? companyId[0] : (companyId as string) || '';
  }
}