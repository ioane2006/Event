import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    
    const loginData = {
      email: form.value.email,
      password: form.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        const token = response.token || response;
        
        if (token) {
          localStorage.setItem('token', token);
          alert('ავტორიზაცია წარმატებით გაიარეთ!');
          this.router.navigate(['/event-list']); 
        }
      },
      error: (err) => {
        console.error('ავტორიზაციის შეცდომა:', err);
        alert('არასწორი ელ-ფოსტა ან პაროლი!');
      }
    });
  }
}