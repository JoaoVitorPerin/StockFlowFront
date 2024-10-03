import { LoadingService } from './../../../shared/components/loader-geral/loader-geral.service';
import { Observable } from 'rxjs';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);
export const SET_LOADER = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements HttpInterceptor {

  readonly urlsPermitidas = [];

  constructor(
    private loadingService: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const setLoader = request.context.get(SET_LOADER)
    const skipLoader = request.context.get(SKIP_LOADER)

    if (setLoader || (request?.method === 'POST' && !skipLoader)) {
      this.loadingService.setLoading(true, request.url);
      return next.handle(request)?.pipe(
          finalize(() => {
            this.loadingService.setLoading(false, request.url);
          })
        )?.pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this.loadingService.setLoading(false, request.url);
          }
          return evt;
        }));
    }

    return next.handle(request);
  }

}
