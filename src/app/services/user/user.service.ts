import { GetAllUsersResponse } from './../../models/interfaces/user/response/GetAllUsersResponse';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { environment } from 'src/environments/environment';
import { AuthRequest } from './auth/AuthRequest';
import { AuthResponse } from './auth/AuthResponse';
import { DeleteUserResponse } from 'src/app/models/interfaces/user/response/DeleteUserResponse';
import { EditUserRequest } from 'src/app/models/interfaces/user/request/EditUserRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  cadastrarUsuario(requestData: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/usuarios`,
      requestData
    )
  }

  logar(requestData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/usuarios/login`,
      requestData
    )
  }

  verificarEstaLogado(): boolean {
    const JWT_TOKEN = this.cookie.get('USUARIO_LOGADO');
    return JWT_TOKEN ? true : false;
  }

  private JWT_TOKEN = this.cookie.get('USUARIO_LOGADO');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.JWT_TOKEN}`,
    }),
  };

  getAllUsers(): Observable<Array<GetAllUsersResponse>> {
    return this.http
      .get<Array<GetAllUsersResponse>>(
        `${this.API_URL}/usuarios`,
        this.httpOptions
      );
  }

  deleteUser(userId: number): Observable<DeleteUserResponse> {
    return this.http.delete<DeleteUserResponse>(
      `${this.API_URL}/usuarios/${userId}`,
      this.httpOptions
    )
  }

  editUser(requestDatas: EditUserRequest): Observable<SignupUserResponse> {
    return this.http.put<SignupUserResponse>(
      `${this.API_URL}/usuarios`,
      requestDatas,
      this.httpOptions
    )
  }
}
