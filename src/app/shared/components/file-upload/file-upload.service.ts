import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../../services/header.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly API_BACK = `${environment.API_BACK}`;
  SKIP_LOADER = SKIP_LOADER;
  data: any;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) { }

  fileUpload(dados: any, diretorio: string, tipo: string): Observable<any> {
    const data = { arquivo: dados, diretorio: diretorio, tipo: tipo }
    return this.http.post<any>(this.API_BACK + 'core/arquivo/upload', data, {
      context: new HttpContext().set(SKIP_LOADER, true),
      headers: this.headerService.getHeader()
    });
  }

  localFileUpload(dados: any, diretorio: string, tipo: string): Observable<any> {
    const data = { arquivo: dados, diretorio: diretorio, tipo: tipo }
    return this.http.post<any>(this.API_BACK + 'core/arquivo/upload/local', data, {
      context: new HttpContext().set(SKIP_LOADER, true),
      headers: this.headerService.getHeader()
    });
  }

  deleteFile(arquivo: any): Observable<any> {
    const data = { lista_arquivos: arquivo }
    return this.http.post<any>(this.API_BACK + 'core/arquivo/deletar', data, {
      context: new HttpContext().set(SKIP_LOADER, true),
      headers: this.headerService.getHeader()
    });
  }

  downloadFile(data: any, diretorio: string, tipo: string): Observable<any> {
    data.diretorio = diretorio;
    data.tipo = tipo;
    return this.http.post<any>(this.API_BACK + 'core/arquivo/download', data, {
      context: new HttpContext().set(SKIP_LOADER, true),
      headers: this.headerService.getHeader()
    });
  }

}
