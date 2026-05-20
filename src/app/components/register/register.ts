import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(form: NgForm): void {
    if (form.invalid) return;

    
    const registerData = {
      email: form.value.email, 
      password: form.value.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        alert('რეგისტრაცია წარმატებით დასრულდა! ახლა გაიარეთ ავტორიზაცია.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('რეგისტრაციის შეცდომა:', err);
        
        if (err.error && typeof err.error === 'object') {
          const errors = err.error.errors || err.error;
          let errorMessage = '';
          
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              if (Array.isArray(errors[key])) {
                errorMessage += `${errors[key].join('\n')}\n`;
              } else {
                errorMessage += `${errors[key]}\n`;
              }
            }
          }
          alert(errorMessage || 'რეგისტრაცია ვერ მოხერხდა. შეამოწმეთ შეყვანილი მონაცემები.');
        } else {
          alert(err.error || 'რეგისტრაცია ვერ მოხერხდა. შესაძლოა პაროლი ძალიან მარტივია.');
        }
      }
    });
  }
}