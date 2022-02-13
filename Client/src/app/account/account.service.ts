import { Router, NavigationExtras } from '@angular/router';
import { IUser } from './../shared/models/user';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IAddress } from '../shared/models/address';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private CurrentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.CurrentUserSource.asObservable();

  constructor(private _http: HttpClient, private _router: Router) { }

  loadCurrent(token: string | null){
    if(token === null){
      this.CurrentUserSource.next(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this._http.get<IUser>(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if(user)
        {
          localStorage.setItem('token', user.token);
          this.CurrentUserSource.next(user);
        }
      })
      );
  }

  login(values: any){
    return this._http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if(user)
        {
          localStorage.setItem('token', user.token);
          this.CurrentUserSource.next(user);
        }
      })
    );
  }

  register(values: any){
    return this._http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if(user)
        {
          localStorage.setItem('token', user.token);
          this.CurrentUserSource.next(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.CurrentUserSource.next(null);
    this._router.navigateByUrl('/');
  }

  checkEmailExists(email: string){
    return this._http.get<boolean>(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this._http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this._http.put<IAddress>(this.baseUrl + 'account/address', address);
  }

}
