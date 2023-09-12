import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/enums/users/UserEvent';
import { DeleteUserAction } from 'src/app/models/interfaces/user/event/DeleteUserAction';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/response/GetAllUsersResponse';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: []
})
export class UsersTableComponent {
  @Input() users: Array<GetAllUsersResponse> = [];
  @Output() userEvent = new EventEmitter<EventAction>();
  @Output() deleteUserEvent = new EventEmitter<DeleteUserAction>();

  public userSelected!: GetAllUsersResponse;
  public addUserEvent = UserEvent.ADD_USER_EVENT;
  public editUserEvent = UserEvent.EDIT_USER_EVENT;

  handleUserEvent(action: string, id?: number): void {
    if(action && action !== '') {
      const userEventData = id ? {action, id} : { action };
      this.userEvent.emit(userEventData);
    }
  }

  handleDeleteUser(userId: number, userName: string): void{
    if(userId && userName && userName != ''){
      this.deleteUserEvent.emit({
        userId, userName
      })
    }
  }
}
