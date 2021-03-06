import { IDeliveryMethod } from './../../shared/models/deliveryMethod';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {

  @Input() checkoutForm!: FormGroup;
  deliveryMethods!: IDeliveryMethod[];

  constructor(private _checkoutService: CheckoutService, private _basketService: BasketService) { }

  ngOnInit(): void {
    this._checkoutService.getDeliveryMethods().subscribe((dm: IDeliveryMethod[]) => {
      this.deliveryMethods = dm;
    }, error => {
      console.log(error);
    })
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this._basketService.setShippingPrice(deliveryMethod);
  }

}
