import { UsersDataTransferService } from './../../../../shared/services/users/users-data-transfer.service';
import { GetAllUsersResponse } from './../../../../models/interfaces/user/response/GetAllUsersResponse';
import { UserService } from 'src/app/services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private usersDataTransferService: UsersDataTransferService
  ){}

  private destroy$ = new Subject<void>();

  public usersList: Array<GetAllUsersResponse> = [];

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData(): void {
    this.userService.getAllUsers()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.usersList = response;
            this.usersDataTransferService.setUsersDatas(this.usersList);
          }
        }, error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar usuários',
            life: 2500,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
