import { Basket, IBasketItem, IBasketTotal } from './../shared/models/basket';
import { IProduct } from './../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { IBasket } from '../shared/models/basket';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketSourceTotal = new BehaviorSubject<IBasketTotal | null>(null);
  basketTotal$ = this.basketSourceTotal.asObservable();
  shipping = 0;
  constructor(private _http: HttpClient) {}

  createPaymentIntent() {
    return this._http
      .post<IBasket>(
        this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id,
        {}
      )
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue());
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket!.deliveryMethodId = deliveryMethod.id;
    basket!.shippingPrice = deliveryMethod.price;
    this.calculateTotals();
    this.setBasket(basket);
    console.log(this.shipping);
  }

  getBasket(id: string) {
    return this._http.get<IBasket>(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
        //console.log(this.getCurrentBasketValue());
      })
    );
  }

  setBasket(basket: IBasket | null) {
    return this._http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe(
      (res: IBasket) => {
        this.basketSource.next(res);
        this.calculateTotals();
        //console.log("set basket: ", res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteBasket(id: string) {
    this._http.delete(this.baseUrl + 'basket?id=' + id).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketSourceTotal.next(null);
        localStorage.removeItem('basket_id');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.items = this.addOrUpdateItem(basket?.items, itemToAdd, quantity);

    this.setBasket(basket);
  }

  increamentItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket!.items.findIndex((i) => i.id === item.id);
    basket!.items[itemIndex].quantity++;
    this.setBasket(basket!);
  }

  decreamentItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket!.items.findIndex((i) => i.id === item.id);
    if (basket!.items[itemIndex].quantity > 1) {
      basket!.items[itemIndex].quantity--;
    } else {
      this.removeItemFromBasket(item);
    }
    this.setBasket(basket!);
  }

  deleteLocalBasket(id?: string) {
    this.basketSource.next(null);
    this.basketSourceTotal.next(null);
    localStorage.removeItem('basket_id');
  }

  //-------------------------SUPPORT METHOD----------------------------
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket?.items.some((i) => i.id === item.id)) {
      basket.items = basket.items.filter((i) => i.id !== item.id);
    }
    if (basket!.items.length > 0) {
      this.setBasket(basket!);
    } else {
      this.deleteBasket(basket!.id);
    }
  }

  private calculateTotals() { 
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping; //shipping cost
    const subtotal = basket!.items.reduce(
      (a, b) => b.price * b.quantity + a,
      0
    );
    const total = subtotal + shipping;
    this.basketSourceTotal.next({ shipping, total, subtotal });
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex((i) => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity: quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}
