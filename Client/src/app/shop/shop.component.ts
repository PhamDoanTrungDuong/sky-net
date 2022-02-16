import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { ShopService } from './shop.service';
import { IProduct } from '../shared/models/product';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: false }) search: any;
  public products: IProduct[] | any = [];
  public brands: IBrand[] = [];
  public types: IType[] = [];
  shopParams!: ShopParams;
  public totalCount: number | any = 0;
  public sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'price' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private _shopService: ShopService) {
    this.shopParams = this._shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProduct(true);
    this.getBrands();
    this.getTypes();
  }
  getProduct(useCache = false) {
    this._shopService.getProducts(useCache).subscribe(response => {
      this.products = response?.data;
      this.totalCount = response?.count;
    }, error => {
      console.log(error);
    })
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
    const params = this._shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this._shopService.setShopParams(params);
    this.getProduct();
  }

  onTypeSelected(typeId: number) {
    const params = this._shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this._shopService.setShopParams(params);
    this.getProduct();
  }

  onSortSelected(sort: string) {
    const params = this._shopService.getShopParams();
    params.sort = sort;
    this._shopService.setShopParams(params);
    this.getProduct();
  }

  onPageChanged(event: any) {
    const params = this._shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this._shopService.setShopParams(params);
      this.getProduct(true);
    }
  }

  onSearch() {
    const params = this._shopService.getShopParams();
    params.search = this.search.nativeElement.value;
    params.pageNumber = 1;
    this._shopService.setShopParams(params);
    this.getProduct();
  }

  onReset() {
    this.search.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this._shopService.setShopParams(this.shopParams);
    this.getProduct();
  }
}
