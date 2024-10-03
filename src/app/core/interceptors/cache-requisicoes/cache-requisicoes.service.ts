import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheRequisicoes implements HttpInterceptor {

  readonly urlsPermitidas = [];

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlWithParams = request.urlWithParams.replace(environment.API_BACK, '');
    const url = request.url.replace(environment.API_BACK, '');
    const path = this.getRequest(urlWithParams + 'cached');

    if (!path) {
      return next.handle(request)?.pipe(
        tap(stateEvent => {
          if (stateEvent instanceof HttpResponse) {
            if (this.urlsPermitidas.indexOf(url) > -1) {
              this.setRequest(urlWithParams + 'cached', stateEvent.clone());
            }
          }
        })
      );
    }
    else {
      const cachedResponse = new HttpResponse(path);
      return of(cachedResponse.clone());
    }
  }

  getRequest(url): any {
    return JSON.parse(localStorage.getItem(url));
  }

  setRequest(url, value: any): void {
    this.clearRequest(url);
    localStorage.setItem(url, JSON.stringify(value));
  }

  clearRequest(url): void {
    localStorage.removeItem(url);
  }

}
