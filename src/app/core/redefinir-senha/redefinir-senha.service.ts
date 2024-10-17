import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from '../interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class RedefinirSenhaService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

    enviarEmail(dados): Observable<any> {
        return this.http.post<any>(`${this.API_BACK}user/enviar_email_reset`, JSON.stringify(dados), {
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),
        context: new HttpContext().set(SKIP_LOADER, true),
        });
    }

    redefinirSenha(dados): Observable<any> {
        return this.http.post<any>(`${this.API_BACK}user/reset_senha`, JSON.stringify(dados), {
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),
        context: new HttpContext().set(SKIP_LOADER, true),
        });
    }
}
