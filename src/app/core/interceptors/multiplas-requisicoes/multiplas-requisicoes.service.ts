import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MultiplasRequisicoes implements HttpInterceptor {

  readonly urlsPermitidas = [];

  constructor() {
    for (const key of Object.keys(localStorage)) {
      if (key.indexOf(environment.API_BACK) > -1) {
        this.clearRequest(key);
      }
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.getRequest(request.urlWithParams + request.method)) {
      if (this.urlsPermitidas.indexOf(request.url) === -1) {
        this.setRequest(request.urlWithParams + request.method, { status: true });
      }
      return next.handle(request)?.pipe(
        finalize(() => {
          this.clearRequest(request.urlWithParams + request.method);
        })
      );
    }
    else {
      // return throwError('Requisição solicitada multipla ' + request.urlWithParams + request.method);
    }
  }

  getRequest(url): any {
    return JSON.parse(localStorage.getItem(url));
  }

  setRequest(url, token: any): void {
    this.clearRequest(url);
    localStorage.setItem(url, JSON.stringify(token));
  }

  clearRequest(url): void {
    localStorage.removeItem(url);
  }

}
