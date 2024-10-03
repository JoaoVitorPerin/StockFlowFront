import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpParams
} from '@angular/common/http';

@Injectable()
export class NotNull implements HttpInterceptor {

  formData: FormData;

  httpParams: HttpParams;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request?.body?.constructor.toString().indexOf('Object') > -1 && (request?.method === 'POST' || request?.method === 'PUT')) {
      this.tratamentoDadosPOST(request.body);

      const clonedRequest = request.clone({ body: this.formData });
      return next.handle(clonedRequest);
    }
    else if (request?.params?.constructor.toString().indexOf('HttpParams') > -1 && request.method === 'GET') {
      this.tratamentoDadosGET(request.params);

      const clonedRequest = request.clone({ params: this.httpParams });
      return next.handle(clonedRequest);
    }
    else {
      return next.handle(request);
    }
  }

  tratamentoDadosPOST(json): any {
    this.formData = new FormData();

    json = this.tratamentoJson(json);

    for (const chave of Object.entries(json)) {
      if (chave[1] || chave[1] === 0) {
        if (Array.isArray(chave[1])) {
          if (chave[1].length > 0) {
            for (const valor of chave[1]) {
              if (valor || valor === 0) {
                if (valor.constructor.toString().indexOf('Object') > -1) {
                  if (Object.entries(valor).length > 1) {
                    Object.keys(valor).forEach(k => (!valor[k] && valor[k] !== undefined && valor[k] != '0') && delete valor[k]);
                    this.formData.append(chave[0], JSON.stringify(valor));
                  } else {
                    this.formData.append(chave[0], JSON.stringify(valor));
                  }
                }
                else {
                  this.formData.append(chave[0], valor);
                }
              }
            }
          }
        }
        else if (chave[1].constructor.toString().indexOf('Object') > -1) {
          this.formData.append(chave[0], JSON.stringify(chave[1]));
        }
        else {
          this.formData.append(chave[0], chave[1].toString());
        }
      }
    }

  }

  tratamentoJson(json): any {
    const novoJson = {};

    for (const chave of Object.entries(json)) {
      if (chave[1] || chave[1] === 0) {
        if (Array.isArray(chave[1])) {
          if (chave[1].length > 0) {
            const novoArray = [];
            for (const valor of chave[1]) {
              if (valor || valor === 0) {
                // Se o valor do array for um objeto
                if (Array.isArray(valor)) {
                  novoArray.push(this.tratamentoJson(valor));
                }
                else if (valor.constructor.toString().indexOf('Object') > -1) {
                  if (Object.entries(valor).length > 1) {
                    Object.keys(valor).forEach(k => (!valor[k] && valor[k] !== undefined && valor[k] != '0') && delete valor[k]);
                    novoArray.push(this.tratamentoJson(valor));
                  } else {
                    novoArray.push(this.tratamentoJson(valor));
                  }
                }
                else {
                  novoArray.push(valor);
                }
              }
            }
            novoJson[chave[0]] = novoArray;
          }
        }
        else if (chave[1].constructor.toString().indexOf('Object') > -1) {
          // se o valor for um objeto
          const valor = chave[1];
          if (Object.entries(valor).length > 1) {
            Object.keys(valor).forEach(k => (!valor[k] && valor[k] !== undefined && valor[k] != '0') && delete valor[k]);
            novoJson[chave[0]] = this.tratamentoJson(valor);
          } else {
            novoJson[chave[0]] = this.tratamentoJson(valor);
          }
        }
        else {
          novoJson[chave[0]] = chave[1];
        }
      }
    }
    return novoJson;
  }

  tratamentoDadosGET(json): any {
    this.httpParams = new HttpParams();
    for (const key of json.keys()) {
      for (const value of json.getAll(key)) {
        if (value || value === 0) {
          this.httpParams = this.httpParams.append(key, value.toString());
        }
      }
    }
  }
}
