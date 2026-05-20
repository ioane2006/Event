import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventService } from '../../services/event';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-add.html',
  styleUrl: './event-add.css'
})
export class EventAddComponent implements OnInit {
  selectedFile: File | null = null;
  minDate: string = '';
  
  eventData = {
    id: 0,
    title: '',
    description: '',
    location: '',
    date: '',
    imageUrl: 'string', 
    maxCapacity: 100, 
    price: 0,
    agenda: [],     
    speakers: []    
  };

  constructor(private eventService: EventService, public router: Router) {}

  ngOnInit(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.minDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.eventData.date = this.minDate; 
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    
    if (this.selectedFile) {
      this.eventService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.eventData.imageUrl = res.imageUrl; 
          this.postEvent();
        },
        error: (err) => {
          console.error('ფოტოს ატვირთვა ჩაიშალა', err);
          alert('ფოტოს ატვირთვა ვერ მოხერხდა!');
        }
      });
    } else {
      this.postEvent();
    }
  }

  postEvent() {
    const finalPayload = {
      id: 0,
      title: this.eventData.title,
      description: this.eventData.description,
      location: this.eventData.location,
      date: new Date(this.eventData.date).toISOString(),
      imageUrl: this.eventData.imageUrl,
      maxCapacity: Number(this.eventData.maxCapacity),
      ticketTypes: [
        {
          id: 0,
          name: 'Standard Ticket',
          price: Number(this.eventData.price), 
          quantity: Number(this.eventData.maxCapacity),
          soldCount: 0,
          eventId: 0
        }
      ],
      agenda: [], 
      speakers: []
    };

    console.log('ბექენდზე იგზავნება საბოლოო Payload:', finalPayload);

    this.eventService.createEvent(finalPayload).subscribe({
      next: () => {
        alert('ღონისძიება წარმატებით დაემატა!');
        this.router.navigate(['/event-list']);
      },
      error: (err) => {
        console.error('შექმნის შეცდომა', err);
        alert('ღონისძიების დამატება ვერ მოხერხდა!');
      }
    });
  }
}