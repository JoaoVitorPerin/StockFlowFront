import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }
  
  buscarTabelaEstoque(marca_id): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'dashboard/estoque', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: marca_id ? {marca_id: marca_id} : null
    });
  }

  buscarDadosEstoqueMarcasGrafico(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'dashboard/marcas-estoque', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader()
    });
  }
}
