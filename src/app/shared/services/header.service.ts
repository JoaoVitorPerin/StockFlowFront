import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  data: any;
  private readonly API = `${environment.API_BACK}`;

  private headers: HttpHeaders;

  acesso: string = '';

  private buscarBreakingNews = new Subject<string>();
  buscarBreakingNews$ = this.buscarBreakingNews.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {
  }

  atualizarBuscarBreakingNews(value) {
    this.buscarBreakingNews.next(value);
  }

  getHeader(adicionais?): any {

    if(this.tokenService?.getToken()?.access)
      this.acesso = `Bearer ${this.tokenService?.getToken() ? this.tokenService?.getToken()?.access : ''}`;

    this.headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: this.acesso,
      ...adicionais
    });

    return this.headers;
  }

  buscarNotificacao(): Observable<any>{
    return this.http.get<any>(this.API + 'core/tarefa/notificacoes/buscar', {
      headers: this.getHeader(),
      params: this.data
    });
  }

  getNotifications(): Observable<any>{
    return this.http.get<any>(this.API + 'core/tarefa/notificacoes/quantidade', {
      headers: this.getHeader(),
      params: this.data
    });
  }

  getBreakingNews(): Observable<any>{
    return this.http.get<any>(this.API + 'core/comunicacao/comunicado/buscar/ultimo/breakingnews', {
      headers: this.getHeader(),
      params: this.data
    });
  }
}
