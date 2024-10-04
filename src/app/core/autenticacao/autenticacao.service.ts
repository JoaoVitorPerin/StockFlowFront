import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SKIP_LOADER } from '../interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  login(dados): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}user/login`, this.data, {
      headers: this.headerService.getHeader(),
      context: new HttpContext().set(SKIP_LOADER, true),
    });
  }
}
