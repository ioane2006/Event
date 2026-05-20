import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  eventId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.eventId = this.route.snapshot.paramMap.get('id');
  }

  processPayment(method: string) {
    alert(`მიმდინარეობს გადახდა ${method}-ით ივენთისთვის: ${this.eventId}...`);
    setTimeout(() => {
      alert("გადახდა წარმატებით დასრულდა!");
      this.router.navigate(['/my-tickets']);
    }, 2000);
  }
}