import { BasketService } from './basket/basket.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skynet';
  constructor(private _basketService: BasketService) {}

  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this._basketService.getBasket(basketId).subscribe(
        () => {
          console.log('Found basket id');
        },
        (error) => {
          console.log(error);
        }
      );
    }

   }
}
