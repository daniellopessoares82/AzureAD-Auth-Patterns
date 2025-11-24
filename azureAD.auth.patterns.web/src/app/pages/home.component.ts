import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../security/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="isAuthenticated(); else loading">
      <h2>Home</h2>
      <p>Usuário autenticado.</p>
      <p><strong>Usuário:</strong> {{ displayName() }}</p>
      <div class="actions">
        <button (click)="validateToken()">Validar Token</button>
        <button (click)="goLogout()">Logout</button>
      </div>
      <div class="result" *ngIf="validationResult() as r">
        <h3>Validação do Token</h3>
        <p *ngIf="r.valid; else invalid">Token válido ✅</p>
        <ng-template #invalid><p>Token inválido ❌ - {{ r.error }}</p></ng-template>
        <details>
          <summary>Claims</summary>
          <pre>{{ r.claims | json }}</pre>
        </details>
      </div>
    </div>
    <ng-template #loading>
      <p>Verificando autenticação...</p>
    </ng-template>
  `,
  styles: [`.container { max-width: 800px; margin:2rem auto; text-align:center; } button { padding:.5rem 1rem; margin:.25rem; } .token-box { max-width:100%; overflow-wrap:anywhere; background:#111; color:#0f0; padding:.5rem; border-radius:4px; font-size:.7rem; text-align:left;} .warn { font-size:.7rem; color:#b00; } details { margin-bottom:.5rem; }`]
})
export class HomeComponent {
  private accountSignal = signal<any | null>(null);
  validationResult = signal<any | null>(null);
  idToken = signal<string | null>(null);
  accessToken = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router, private api: ApiService) {
    const acc = this.auth.getAccount();
    if (acc) this.accountSignal.set(acc);
    // Carregar tokens iniciais de forma assíncrona (não bloqueia render)
    this.loadTokens();
  }
  async loadTokens() {
    // ID Token
    const idTok = await this.auth.getIdToken();
    this.idToken.set(idTok);
    // Access Token
    const accTok = await this.auth.getApiAccessToken();
    this.accessToken.set(accTok);
  }

  isAuthenticated = computed(() => !!this.accountSignal());

  displayName = computed(() => this.auth.getAccount()?.name || this.auth.getAccount()?.username || 'Desconhecido');

  validateToken() {
    this.validationResult.set({ loading: true });
    this.api.validateToken().subscribe({
      next: r => this.validationResult.set(r),
      error: err => this.validationResult.set({ valid: false, error: err.message || 'Erro desconhecido' })
    });
  }

  goLogout() { this.router.navigate(['/logout']); }
}
