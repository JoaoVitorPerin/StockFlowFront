import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class SepararPedidoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

    buscarDadosPedidos(): Observable<any>{
        return this.http.get<any>(this.API_BACK + 'pedido/cadastro', {
            context: new HttpContext().set(SET_LOADER, true),
            headers: this.headerService.getHeader(),
        });
    }

    alterarStatusPedido(idPedido: number): Observable<any>{
        return this.http.post<any>(this.API_BACK + `pedido/status`, {pedido_id: idPedido}, {
            headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),
            context: new HttpContext().set(SET_LOADER, true),
        });
    }
}
