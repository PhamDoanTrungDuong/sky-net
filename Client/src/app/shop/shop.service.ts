import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { IPagination, Pagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  BASE_URL = 'https://localhost:5001/api/';
  products: IProduct[] | undefined = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination: any = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private _http: HttpClient) {}

  getProducts(useCache: boolean) {
    if (useCache === false) {
      this.productCache = new Map();
    }

    if (this.productCache.size > 0 && useCache === true) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandId !== 0) {
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

     return this._http.get<IPagination>(this.BASE_URL + 'products', { observe: 'response', params })
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
          this.pagination = response.body;
          return this.pagination;
        })
      )
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number): Observable<IProduct> {
    const product = this.products?.find((p) => p.id === id);

    if (product) {
      return of(product);
    }
    return this._http.get<IProduct>(this.BASE_URL + 'products/' + id);
  }

  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this._http.get<IBrand[]>(this.BASE_URL + 'products/brands').pipe(
      map((response) => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this._http.get<IType[]>(this.BASE_URL + 'products/types').pipe(
      map((response) => {
        this.types = response;
        return response;
      })
    );
  }
}
