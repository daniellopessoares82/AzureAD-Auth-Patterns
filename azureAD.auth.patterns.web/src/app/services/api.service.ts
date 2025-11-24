import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface TokenValidationResponse {
  valid: boolean;
  error?: string;
  header?: any;
  claims?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.backendUrl;
  constructor(private http: HttpClient) {}

  validateToken(): Observable<TokenValidationResponse> {
    // Authorization header é adicionado pelo authInterceptor
    return this.http.get<TokenValidationResponse>(`${this.baseUrl}/auth/validate`);
  }
}
