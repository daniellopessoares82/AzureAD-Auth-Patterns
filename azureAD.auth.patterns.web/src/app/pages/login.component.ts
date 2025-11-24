import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Login</h2>
      <p *ngIf="!started">Preparando redirecionamento...</p>
      <p *ngIf="started">Redirecionando para Azure AD...</p>
    </div>
  `,
  styles: [`.container { max-width: 400px; margin: 2rem auto; text-align:center; }`]
})
export class LoginComponent implements OnInit {
  started = false;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Se já autenticado, vai direto para /home
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
      return;
    }
    // Se já há interação em progresso, não inicia outra
    if (this.auth.isInteractionInProgress()) {
      this.started = true;
      return;
    }
    this.started = true;
    this.auth.login();
  }
}
