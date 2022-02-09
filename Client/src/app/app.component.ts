import { BasketService } from './basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skynet';
  
  constructor(
    private _basketService: BasketService,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this._accountService.loadCurrent(token).subscribe(
      () => {
         console.log('Loaded user');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadBasket() {
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
