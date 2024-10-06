import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_LOADER } from 'src/app/core/interceptors/loader/loader.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatagridPrimeService {

  private readonly API_BACK = `${environment.API_BACK}`;
  SKIP_LOADER = SKIP_LOADER;
  data: any;

  constructor(
    private http: HttpClient,
  ) { }

  getLazyLoad({ event, url, params }) {
    const data = this.formatLazyLoadData(event);
    return this.http.post(`${this.API_BACK}${url}`, JSON.stringify({ ...data, ...params }));
  }

  formatLazyLoadData(data) {
    const { globalFilter: pesquisa, sortField: coluna, sortOrder: ordernacao, rows, first } = data;
    return {
      pesquisa: pesquisa,
      rows: rows || 10,
      first: first || 0,
      ordenacao: ordernacao && coluna && {
        coluna: coluna || '',
        ordem: ordernacao === 1 ? 'asc' : 'desc'
      }
    };
  }
}
