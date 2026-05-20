import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../services/event';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tickets.html',
  styleUrls: ['./my-tickets.css']
})
export class MyTicketsComponent implements OnInit {
  myTickets: any[] = [];

  constructor(private eventService: EventService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.eventService.getMyTickets().subscribe({
      next: (data) => {
        this.myTickets = data;
        
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('შეცდომა ჩატვირთვისას:', err)
    });
    
  }

  cancelTicket(ticketId: number): void {
    if (confirm('ნამდვილად გსურთ ბილეთის გაუქმება?')) {
      this.eventService.refundTicket(ticketId).subscribe({
        next: () => {
          alert('ბილეთი წარმატებით გაუქმდა');
          this.loadTickets();
        },
        error: (err) => console.error('გაუქმება ვერ მოხერხდა:', err)
      });
    }
  }
}