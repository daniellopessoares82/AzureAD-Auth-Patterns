import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './security/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('azureAD.auth.patterns.web');
  
  constructor(private auth: AuthService) {}
  
  ngOnInit(): void {
    // AuthService já inicializa MSAL no constructor
  }
}
