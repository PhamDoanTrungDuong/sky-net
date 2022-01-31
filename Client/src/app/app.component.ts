import { IProduct } from './models/product';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skynet';
  products: IProduct[] = [];
  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
     this._http.get<IPagination>('https://localhost:5001/api/products?pageSize=50').subscribe(
      (res: IPagination) => { 
        // console.log(res);
        this.products = res.data
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
