import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PublicClientApplication, AccountInfo, AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private pca = new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      redirectUri: environment.azureAd.redirectUri
    },
    cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false }
  });

  constructor(private router: Router) {
    if (this.isBrowser()) {
      this.pca.initialize().then(() => {
        this.handleRedirectPromise();
      });
    }
  }

  async handleRedirectPromise(): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      const response = await this.pca.handleRedirectPromise();
      if (response && response.account) {
        this.pca.setActiveAccount(response.account);
        // Redirecionar para home após autenticação bem-sucedida
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Erro no callback de autenticação:', error);
    }
  }

  private isBrowser(): boolean { return typeof window !== 'undefined'; }

  login() {
    if (!this.isBrowser()) return Promise.resolve();
    // Verificar se já há interação em progresso
    if (this.pca.getActiveAccount() || this.isInteractionInProgress()) {
      return Promise.resolve();
    }
    const apiScope = environment.azureAd.apiScope;
    return this.pca.loginRedirect({ scopes: ['openid','profile','email', apiScope] });
  }

  isInteractionInProgress(): boolean {
    if (!this.isBrowser()) return false;
    try {
      // Verificar se há interação em progresso através do cache local
      const keys = Object.keys(localStorage);
      return keys.some(key => key.includes('msal') && key.includes('interaction'));
    } catch {
      return false;
    }
  }

  logout() {
    if (!this.isBrowser()) return Promise.resolve();
    return this.pca.logoutRedirect({ postLogoutRedirectUri: 'http://localhost:4200/login' });
  }

  getAccount(): AccountInfo | null {
    const active = this.pca.getActiveAccount();
    if (active) return active;
    const accounts = this.pca.getAllAccounts();
    if (accounts.length > 0) {
      this.pca.setActiveAccount(accounts[0]);
      return accounts[0];
    }
    return null;
  }

  isAuthenticated(): boolean { return !!this.getAccount(); }

  async acquireToken(scopes: string[]): Promise<string | null> {
    const account = this.getAccount();
    if (!account) return null;
    if (!this.isBrowser()) return null;
    try {
      const result: AuthenticationResult = await this.pca.acquireTokenSilent({ scopes, account });
      return result.accessToken || result.idToken;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await this.pca.acquireTokenRedirect({ scopes });
      }
      return null;
    }
  }

  async acquireApiToken(): Promise<string | null> {
    const account = this.getAccount();
    if (!account || !this.isBrowser()) return null;
    const apiScope = environment.azureAd.apiScope;
    try {
      const result = await this.pca.acquireTokenSilent({ scopes: [apiScope], account });
      return result.accessToken;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await this.pca.acquireTokenRedirect({ scopes: [apiScope] });
      }
      return null;
    }
  }

  async getIdToken(): Promise<string | null> {
    const account = this.getAccount();
    if (!account || !this.isBrowser()) return null;
    try {
      const result = await this.pca.acquireTokenSilent({ scopes: ['openid','profile','email'], account });
      return result.idToken ?? null;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await this.pca.acquireTokenRedirect({ scopes: ['openid','profile','email'] });
      }
      return null;
    }
  }

  async getApiAccessToken(): Promise<string | null> {
    return this.acquireApiToken();
  }
}