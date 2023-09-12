import { UsersDataTransferService } from './../../../../shared/services/users/users-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UserEvent } from 'src/app/models/enums/users/UserEvent';
import { GetRolesResponse } from 'src/app/models/interfaces/roles/responses/GetRolesResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { EditUserRequest } from 'src/app/models/interfaces/user/request/EditUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/response/GetAllUsersResponse';
import { RolesService } from 'src/app/services/roles/roles.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: []
})
export class UserFormComponent implements OnInit, OnDestroy{

  private readonly destroy$: Subject<void> = new Subject();
  public rolesDatas: Array<GetRolesResponse> = [];
  public selectedRole: Array<{codigo: string}> = [];
  public userAction!: {
    event: EventAction,
    userDatas: Array<GetAllUsersResponse>;
  }
  public userSelectedDatas!: GetAllUsersResponse;
  public userDatas: Array<GetAllUsersResponse> = [];

  public addUserForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', Validators.required],
    senha: ['', Validators.required],
    papelId: [0, Validators.required],
  });

  public editUserForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', Validators.required],
  });

  public addUserAction = UserEvent.ADD_USER_EVENT;
  public editUserAction = UserEvent.EDIT_USER_EVENT;

  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private usersDataTransferService: UsersDataTransferService,
    public ref: DynamicDialogConfig,

  ) {}


  getAllRoles(): void{
    this.rolesService.getAllRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0) {
            this.rolesDatas = response;
          }
        }
      });
  }

  handleSubmitAddUser():void {
    if(this.addUserForm?.value && this.addUserForm?.valid) {
      const requestCreateUser: SignupUserRequest = {
        nome: this.addUserForm.value.nome as string,
        email: this.addUserForm.value.email as string,
        senha: this.addUserForm.value.senha as string,
        permissoes: [
          {
            id: Number(this.addUserForm.value.papelId),
            codigo: '',
          },
        ],
      };

      this.userService.cadastrarUsuario(requestCreateUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuario criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar usuário!',
              life: 2500,
            });
          }
        })
    }

    this.addUserForm.reset();
  }

  handleSubmitEditUser(): void {
    if(this.editUserForm.value
      && this.editUserForm.valid
      && this.userAction.event.id) {
        const requestEditProduct: EditUserRequest = {
          id: Number(this.userAction.event.id),
          email: this.editUserForm.value.email as string,
          nome: this.editUserForm.value.nome as string
        }

        this.userService.editUser(requestEditProduct)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário editado com sucesso',
                life: 2500,
              });
              this.editUserForm.reset();
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao editar usuário',
                life: 2500,
              });
              this.editUserForm.reset();
            }
          })
    }
  }

  getUserSelectedDatas(userId: number): void {
    const allUsers = this.userAction?.userDatas;

    if(allUsers.length > 0){
      const userFiltered = allUsers.filter(
        (element) => element?.id === userId
      );

      if(userFiltered) {
        this.userSelectedDatas = userFiltered[0];

        this.editUserForm.setValue({
          nome: this.userSelectedDatas?.pessoa.nome,
          email: this.userSelectedDatas?.email,
        });
      }
    }
  }

  getUserDatas(): void {
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.userDatas = response;
            this.userDatas && this.usersDataTransferService.setUsersDatas(this.userDatas);
          }
        }
      });
  }

  ngOnInit(): void {
    this.userAction = this.ref.data;

    if(this.userAction?.event?.action === this.editUserAction
      && this.userAction?.userDatas){
        this.getUserSelectedDatas(Number(this.userAction?.event?.id));
    }

    this.getAllRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
