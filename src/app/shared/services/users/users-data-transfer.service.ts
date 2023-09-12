import { GetAllUsersResponse } from './../../../models/interfaces/user/response/GetAllUsersResponse';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersDataTransferService {
  public usersDataEmitter$ = new BehaviorSubject<Array<GetAllUsersResponse> | null >(null);

  public usersDatas: Array<GetAllUsersResponse> = [];

  setUsersDatas(users : Array<GetAllUsersResponse>): void {
    if(users) {
      this.usersDataEmitter$.next(users);
      this.getUsersDatas();
    }
  }

  getUsersDatas() {
    this.usersDataEmitter$.pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        if (response){
          this.usersDatas = response;
        }
      },
    });

    return this.usersDatas;
  }
}
