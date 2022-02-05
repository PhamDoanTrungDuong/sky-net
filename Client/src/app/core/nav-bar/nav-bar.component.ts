import { Basket, IBasket } from './../../shared/models/basket';
import { BasketService } from './../../basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  basket$!: Observable<IBasket | null>;
  
  constructor(private _basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this._basketService.basket$;

  }

}
