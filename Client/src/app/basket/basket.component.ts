import { BasketService } from './basket.service';
import { IBasket, IBasketItem, IBasketTotal } from './../shared/models/basket';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  basket$!: Observable<IBasket | null>;
  basketTotals$!: Observable<IBasketTotal | null>;

  constructor(private _basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this._basketService.basket$;
    this.basketTotals$ = this._basketService.basketTotal$;
  }
  removeBasketItem(item: IBasketItem) {
    this._basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this._basketService.increamentItemQuantity(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this._basketService.decreamentItemQuantity(item);
  }
}
