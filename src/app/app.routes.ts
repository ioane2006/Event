import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EventListComponent } from './components/event-list/event-list';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { EventAddComponent } from './components/event-add/event-add';
import { EventDetailsComponent } from './components/event-details/event-details';
import { MyTicketsComponent } from './components/my-tickets/my-tickets';
import { RegisterComponent } from './components/register/register';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  
  { path: 'event-list', component: EventListComponent }, 
  
  
  { path: '', redirectTo: 'event-list', pathMatch: 'full' }, 
  { path: 'checkout/:id', component: CheckoutComponent },
  
  
  { 
    path: 'my-tickets', 
    component: MyTicketsComponent,
    canActivate: [() => localStorage.getItem('token') ? true : inject(Router).navigate(['/login'])]
  },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  
  { path: 'add-event', component: EventAddComponent },
  { path: 'event-details/:id', component: EventDetailsComponent }
];