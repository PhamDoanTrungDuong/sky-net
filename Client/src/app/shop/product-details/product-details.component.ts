import { ShopService } from './../shop.service';
import { IProduct } from './../../shared/models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product!: IProduct;
  public quantity = 1;
  constructor(private _shopService: ShopService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadProduct();
  }


  loadProduct() {
    this._shopService.getProduct(+this.activateRoute.snapshot.paramMap.getAll('id')).subscribe(
      (res) => {
        this.product = res;
        console.log('Product: ', this.product);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}