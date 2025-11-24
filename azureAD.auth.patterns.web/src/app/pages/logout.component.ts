import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Logout</h2>
      <p>Saindo...</p>
    </div>
  `,
  styles: [`.container { max-width: 400px; margin:2rem auto; text-align:center; }`]
})
export class LogoutComponent {
  constructor(private auth: AuthService) {
    this.auth.logout();
  }
}
