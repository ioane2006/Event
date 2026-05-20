import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetailsComponent implements OnInit {
  event: any;
  selectedTicket: any = null;
  reviewForm: FormGroup;
  showPaymentModal = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadEventDetails();
  }

  loadEventDetails() {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr); 
    
    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (data) => {
          this.event = data;
          if (this.event.ticketTypes && this.event.ticketTypes.length > 0) {
            this.selectedTicket = this.event.ticketTypes[0];
          }
          this.cd.detectChanges(); 
        },
        error: (err) => console.error('მონაცემების ჩატვირთვის შეცდომა:', err)
      });
    }
  }

  buyTicket() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('ბილეთის საყიდლად გთხოვთ გაიაროთ ავტორიზაცია ან დარეგისტრირდეთ!');
      this.router.navigate(['/login']);
      return;
    }
    
    this.showPaymentModal = true;
  }

  
  processPayment(method: string) {
    const ticket = this.event.ticketTypes[0];
    
    this.eventService.bookTicket(this.event.id, ticket.id).subscribe({
      next: () => {
        alert(`გადახდა ${method}-ით წარმატებით დასრულდა!`);
        this.showPaymentModal = false;
        this.loadEventDetails(); 
      },
      error: (err) => {
        console.error('ყიდვა ვერ მოხერხდა:', err);
        alert('გადახდა ვერ მოხერხდა.');
      }
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      this.eventService.addReview(this.event.id, this.reviewForm.value).subscribe({
        next: () => {
          alert('მადლობა შეფასებისთვის!');
          this.reviewForm.reset({ rating: 5, comment: '' });
        },
        error: (err) => {
          console.error('შეფასების გაგზავნა ვერ მოხერხდა:', err);
          alert('შეფასების დამატება ვერ მოხერხდა.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/event-list']); 
  }
}