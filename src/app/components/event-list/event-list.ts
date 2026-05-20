import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventListComponent implements OnInit, OnDestroy {
  events: any[] = [];
  intervalId: any;

  searchText: string = '';
  selectedLocation: string = '';
  selectedDate: string = '';
  locations: string[] = [];

  constructor(private eventService: EventService, private cd: ChangeDetectorRef) {}

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

  deleteEvent(id: number, eventTitle: string): void {
    if (confirm(`ნამდვილად გსურთ ღონისძიების — "${eventTitle}" წაშლა?`)) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          alert('ღონისძიება წარმატებით წაშლილია');
          this.loadEvents(); 
        },
        error: (err) => console.error('წაშლა ვერ მოხერხდა:', err)
      });
    }
  }

  ngOnInit(): void {
    this.loadEvents();

    this.intervalId = setInterval(() => {
      this.loadEvents();
      console.log('სიაც დარეფრეშდა!');
    }, 5000);
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.extractLocations(data);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  extractLocations(data: any[]): void {
    if (data && data.length > 0) {
      this.locations = [...new Set(data.map((e: any) => e.location))].filter(Boolean) as string[];
    }
  }

  get filteredEvents() {
    return this.events.filter(event => {
      const matchesSearch = !this.searchText || 
        event.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesLocation = !this.selectedLocation || event.location === this.selectedLocation;
      
      let matchesDate = true;
      if (this.selectedDate && event.date) {
        const eventDateString = event.date.split('T')[0];
        matchesDate = eventDateString === this.selectedDate;
      }

      return matchesSearch && matchesLocation && matchesDate;
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}