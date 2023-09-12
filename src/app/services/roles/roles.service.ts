import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GetRolesResponse } from 'src/app/models/interfaces/roles/responses/GetRolesResponse';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private httpClient: HttpClient,
    private cookie: CookieService,
  ) { }

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get("USUARIO_LOGADO");

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.JWT_TOKEN}`,
    }),
  };

  getAllRoles(): Observable<Array<GetRolesResponse>> {
    return this.httpClient.get<Array<GetRolesResponse>>(
      `${this.API_URL}/papeis`,
      this.httpOptions
    )
  }
}
