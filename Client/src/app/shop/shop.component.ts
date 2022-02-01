import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { ShopService } from './shop.service';
import { IProduct } from '../shared/models/product';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) search: any;
  public products: IProduct[] = [];
  public brands: IBrand[] = [];
  public types: IType[] = [];
  shopParams = new ShopParams();
  public totalCount = 0;
  public sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'price' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private _shopService: ShopService) {}

  ngOnInit(): void {
    this.getProduct();
    this.getBrands();
    this.getTypes();
  }
  getProduct() {
    this._shopService.getProducts(this.shopParams).subscribe(
      (res) => {
        this.products = res.data;
        this.shopParams.pageNumber = res.pageIndex;
        this.shopParams.pageSize = res.pageSize;
        this.totalCount = res.count;

        //console.log('Products: ', this.products);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getBrands() {
    this._shopService.getBrands().subscribe(
      (res) => {
        this.brands = [{ id: 0, name: 'All' }, ...res];
        //console.log('Brands: ', this.brands);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getTypes() {
    this._shopService.getTypes().subscribe(
      (res) => {
        this.types = [{ id: 0, name: 'All' }, ...res];
        //console.log('Types: ', this.types);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProduct();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProduct();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProduct();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProduct();
    }
  }

  onSearch() {
    this.shopParams.search = this.search.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProduct();
  }

  onReset() {
    this.search.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProduct();
  }
}
