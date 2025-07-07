import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth/services/auth.service';
import { KeycloakProfile } from 'keycloak-js';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    RouterOutlet,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  isAuthenticated = false;
  profile: KeycloakProfile | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated =  this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getUserProfile().subscribe(profile => {
        this.profile = profile;
      });
    }
  }

  login(): void {
    this.authService.login().subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  
}
