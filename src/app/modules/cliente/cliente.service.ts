import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDadosClientes(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'cliente/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  buscarClienteById(id: string | number): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'cliente/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: {cliente_id: id}
    });
  }

  cadastrarCliente(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'cliente/cadastro', data, {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }

  alterarStatusCliente(id: string | number): Observable<any>{
    return this.http.delete<any>(this.API_BACK + 'cliente/cadastro', {
        context: new HttpContext().set(SET_LOADER, true), 
        headers: this.headerService.getHeader(),
        params: {cliente_id: id}
    });
  }
}
