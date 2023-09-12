import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UsersDataTransferService } from './../../../../shared/services/users/users-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/response/GetAllUsersResponse';
import { UserService } from 'src/app/services/user/user.service';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: []
})
export class UsersHomeComponent implements OnDestroy, OnInit{

  private readonly destroy$: Subject<void> = new Subject();
  public usersDatas: Array<GetAllUsersResponse> = [];
  public ref!: DynamicDialogRef;

  constructor(
    private userService: UserService,
    private usersDataTransferService: UsersDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) {}

  getServiceUsersDatas() {
    const usersLoaded = this.usersDataTransferService.getUsersDatas();

    if(usersLoaded.length > 0){
      this.usersDatas = usersLoaded;
    }else {
      this.getAPIUsersDatas();
    }
  }

  getAPIUsersDatas(){
    this.userService.getAllUsers()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.usersDatas = response;
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao buscar usuários',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);

        }
      });
  }

  handleUserAction(event: EventAction):void{
    if(event) {
      this.ref = this.dialogService.open(UserFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          userDatas: this.usersDatas,
        },
      });

      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIUsersDatas(),
        })
    }
  }

  handleDeleteUserAction(event: {
    userId: number;
    userName: string;
  }): void {
    if(event){
      this.confirmationService.confirm({
        message: `Confirm a exclusão do usuário: ${event?.userName}`,
        header: 'Confirmação da exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteUser(event?.userId),
      });
    }
  }

  deleteUser(userId: number): void {
    if(userId){
      this.userService.deleteUser(userId)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            if(response) {
              this.messageService.add({
                severity: 'sucess',
                summary: 'Sucesso',
                detail: response?.mensagem,
                life: 2500,
              });

              this.getAPIUsersDatas();
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover o usuário',
              life: 2500,
            });
          }
        });
    }
  }

  ngOnInit(): void {
    this.getServiceUsersDatas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
