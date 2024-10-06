import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDadosFilial(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'user/gestao', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  buscarUserById(id: string | number): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'user/gestao', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: {user_id: id}
    });
  }

  cadastrarUser(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'user/cadastro', JSON.stringify(data), {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }
}