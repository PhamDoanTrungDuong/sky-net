import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotal } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  basketTotal$!: Observable<IBasketTotal | null>;
  @Input() shippingPrice: number = 0;
  @Input() subtotal: number = 0;
  @Input() total: number = 0;

  constructor(
    private _basketService: BasketService,
    private _fb: FormBuilder,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    this.basketTotal$ = this._basketService.basketTotal$;
  }

  createCheckoutForm() {
    //console.log('createCheckoutForm');
    this.checkoutForm = this._fb.group({
      addressForm: this._fb.group({
        fisrtName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      deliveryForm: this._fb.group({
        deliveryMethod: [null, Validators.required],
      }),
      paymentForm: this._fb.group({
        nameOnCard: [null, Validators.required],
      }),
    });
  }

  getAddressFormValues() {
    this._accountService.getUserAddress().subscribe(
      (address) => {
        if (address) {
          this.checkoutForm.get('addressForm')?.patchValue(address);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getDeliveryMethodValue() {
    const basket = this._basketService.getCurrentBasketValue();
    if (basket?.deliveryMethodId !== null) {
      this.checkoutForm
        .get('deliveryForm')
        ?.get('deliveryMethod')
        ?.patchValue(basket?.deliveryMethodId?.toString());
    }
  }
}
