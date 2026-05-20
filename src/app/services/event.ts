import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewRequest } from '../components/review.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private apiUrl = 'https://localhost:7252/api/Events'; 

  constructor(private http: HttpClient) { }

  
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
    
  
  createEvent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }



  
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }

  
  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  
  bookTicket(eventId: number, ticketTypeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchase-ticket/${ticketTypeId}`, {});
  }

  
  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-tickets`);
  }

  
  refundTicket(ticketId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/refund-ticket/${ticketId}`);
  }

  
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  private getHeaders() {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  }

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-reviews`, { headers: this.getHeaders() });
  }

  addReview(eventId: number, data: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/${eventId}/reviews`, data);
  }



}