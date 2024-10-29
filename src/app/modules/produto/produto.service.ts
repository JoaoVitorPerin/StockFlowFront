import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SET_LOADER, SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  SKIP_LOADER = SKIP_LOADER;
  SET_LOADER = SET_LOADER;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  buscarDadosProdutos(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'produto/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  buscarProdutoById(id: string | number): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'produto/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: {produto_id: id}
    });
  }

  cadastrarProduto(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'produto/cadastro', data, {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }

  alterarStatusProduto(id: string | number): Observable<any>{
    return this.http.delete<any>(this.API_BACK + 'produto/cadastro', {
        context: new HttpContext().set(SET_LOADER, true), 
        headers: this.headerService.getHeader(),
        params: {produto_id: id}
    });
  }

  movimentarEstoque(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'produto/estoque', data, {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }
    
}
