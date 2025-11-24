import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  
  console.log('🔍 Interceptor executado para URL:', req.url);
  console.log('🔍 Backend URL configurado:', environment.backendUrl);
  
  if (!req.url.startsWith(environment.backendUrl)) {
    console.log('❌ URL não é da API, pulando interceptor');
    return next(req);
  }
  
  console.log('✅ URL é da API, obtendo token...');
  // Obtém Access Token para a API (não ID Token)
  return from(auth.acquireApiToken()).pipe(
    switchMap(token => {
      if (token) {
        console.log('🔑 Token obtido, adicionando ao header:', token.substring(0, 20) + '...');
        const authReq = req.clone({ 
          setHeaders: { Authorization: `Bearer ${token}` } 
        });
        return next(authReq);
      }
      console.log('❌ Nenhum token disponível');
      return next(req);
    })
  );
};