import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  BASE_URL = 'https://localhost:5001/api/';
  constructor(private _http: HttpClient) {}

  getProducts(shopParams: ShopParams): Observable<IPagination> {
    let params = new HttpParams();

    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if(shopParams.search){
      params = params.append('search', shopParams.search)
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this._http.get<IPagination>(this.BASE_URL + 'products', { params: params });
  }

  getBrands(): Observable<IBrand[]> {
    return this._http.get<IBrand[]>(this.BASE_URL + 'products/brands');
  }

  getTypes(): Observable<IType[]> {
    return this._http.get<IType[]>(this.BASE_URL + 'products/types');
  }
}
