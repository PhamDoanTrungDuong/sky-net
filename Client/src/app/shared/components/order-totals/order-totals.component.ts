import { BasketService } from './../../../basket/basket.service';
import { IBasketTotal } from './../../models/basket';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  basketTotal$!: Observable<IBasketTotal | null>;
  @Input() shippingPrice?: number = 0;
  @Input() subtotal?: number = 0;
  @Input() total?: number = 0;
  constructor(private __basketService: BasketService) { }

  ngOnInit(): void {
    this.basketTotal$ = this.__basketService.basketTotal$;
  }

}
