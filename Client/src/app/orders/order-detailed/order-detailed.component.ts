import { OrdersService } from './../orders.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IOrder } from './../../shared/models/order';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order!: IOrder;

  constructor(private _route: ActivatedRoute, private _breacrumbService: BreadcrumbService, private _orderService: OrdersService) { 
    this._breacrumbService.set('@OrderDetailed', '');
  }

  ngOnInit(): void {
    this._orderService.getOrderDetailed(+this._route.snapshot.paramMap.getAll('id'))
      .subscribe((order: IOrder) => {
        this.order = order;
        this._breacrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
      }, error => {
        console.log(error);
      })
  }

}
