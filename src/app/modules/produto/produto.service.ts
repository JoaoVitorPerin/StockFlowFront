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

  historicoMovimentacaoEstoque(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'produto/estoque', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  cadastrarMarca(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'marca/cadastro', data, {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }

  buscarTodasMarcas(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'marca/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  buscarMarcaById(id: string | number): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'marca/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: {marca_id: id}
    });
  }

  cadastrarCategoria(data: any): Observable<any>{
    return this.http.post<any>(this.API_BACK + 'categoria/cadastro', data, {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader({ 'Content-Type': 'application/json' }),  
    });
  }

  buscarTodasCategorias(): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'categoria/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
    });
  }

  buscarCategoriaById(id: string | number): Observable<any>{
    return this.http.get<any>(this.API_BACK + 'categoria/cadastro', {
        context: new HttpContext().set(SET_LOADER, true),
        headers: this.headerService.getHeader(),
        params: {categoria_id: id}
    });
  }
    
}
