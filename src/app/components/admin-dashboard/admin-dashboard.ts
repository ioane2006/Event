import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  events: any[] = [];
  reviews: any[] = []; 

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAllReviews(); 
  }

  loadDashboardData(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('სტატისტიკის ჩატვირთვა ჩაიშალა:', err)
    });
  }

  
  loadAllReviews(): void {
    this.eventService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('შეფასებების ჩატვირთვა ჩაიშალა:', err)
    });
  }
  
  getEventRevenue(event: any): number {
    const ticket = event.ticketTypes?.[0];
    if (!ticket) return 0;
    return (ticket.soldCount || 0) * (ticket.price || 0);
  }

  getTotalRevenue(): number {
    return this.events.reduce((sum, ev) => sum + this.getEventRevenue(ev), 0);
  }

  getTotalSoldTickets(): number {
    return this.events.reduce((sum, ev) => sum + (ev.ticketTypes?.[0]?.soldCount || 0), 0);
  }

  getFillPercentage(event: any): number {
    if (!event.maxCapacity) return 0;
    const sold = event.ticketTypes?.[0]?.soldCount || 0;
    const percent = (sold / event.maxCapacity) * 100;
    return Math.round(percent);
  }


  
}