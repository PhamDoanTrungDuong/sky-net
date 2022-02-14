import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl = environment.apiUrl

  constructor(private _http: HttpClient) { }

  getOrdersForUser(){
    return this._http.get(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number){
    return this._http.get(this.baseUrl + 'orders/' + id);
  }

}
