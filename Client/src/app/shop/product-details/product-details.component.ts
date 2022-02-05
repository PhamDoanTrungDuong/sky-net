import { ShopService } from './../shop.service';
import { IProduct } from './../../shared/models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product!: IProduct;
  public quantity = 1;
  constructor(private _shopService: ShopService, private activateRoute: ActivatedRoute, private bcService: BreadcrumbService, private basketService: BasketService) {
    this.bcService.set('@productDetails', ' ');
  }

  ngOnInit() {
    this.loadProduct();
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  increamentQuantity() {
    if(this.quantity < 10) {
      this.quantity++;
    }
  }

  decreamentQuantity() {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }


  loadProduct() {
    this._shopService.getProduct(+this.activateRoute.snapshot.paramMap.getAll('id')).subscribe(
      (res) => {
        this.product = res;
        this.bcService.set('@productDetails', this.product.name);
        //console.log('Product: ', this.product);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
