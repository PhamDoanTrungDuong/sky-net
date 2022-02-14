import { Observable } from 'rxjs';
import { OrdersService } from './orders.service';
import { IOrder } from './../shared/models/order';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private _orderService: OrdersService) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this._orderService.getOrdersForUser().subscribe((orders: IOrder[] | any) => {
      this.orders = orders;
      //console.log(orders);
    }, error => {
      console.log(error);
    });
  }
}
