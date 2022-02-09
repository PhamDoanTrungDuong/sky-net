import { IUser } from './../../shared/models/user';
import { AccountService } from './../../account/account.service';
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
  currentUser$!: Observable<IUser | null>;
  
  constructor(private _basketService: BasketService, private _accountService: AccountService) { }

  ngOnInit(): void {
    this.basket$ = this._basketService.basket$;
    this.currentUser$ = this._accountService.currentUser$;
  }

  logout(){
    this._accountService.logout();
  }

}
