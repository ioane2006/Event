import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  
  get isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'];
      return role === 'Admin';
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    alert('თქვენ გამოხვედით სისტემიდან!');
    this.router.navigate(['/login']);
  }


  
  
}