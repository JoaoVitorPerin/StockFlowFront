import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { environment } from './../../../../environments/environment';
import { LoadingService } from './../../../shared/components/loader-geral/loader-geral.service';
import { TokenService } from '../../services/token.service';
import { Observable, throwError, timer } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retryWhen, mergeMap, finalize, tap } from 'rxjs/operators';


export const genericRetryStrategy = ({
  maxRetryAttempts = 0,
  scalingDuration = 1000,
  excludedStatusCodes = [502, 503, 0],
}: {
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[],
} = {}) => (attempts: Observable<any>) => {
  return attempts?.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      const errosNumber = excludedStatusCodes.filter(e => e === error?.status);
      if (
        retryAttempt > maxRetryAttempts ||
        errosNumber.length === 0
      ) {
        return throwError(error);
      }
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => { })
  );
};

@Injectable({
  providedIn: 'root'
})
export class TratamentoErrosService implements HttpInterceptor {

  private readonly API_BACK = `${environment.API_BACK}`;

  readonly urlsPermitidas = [];

  constructor(
    private tokenService: TokenService,
    private loadingService: LoadingService,
    private toastrService: ToastrService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)?.pipe(
        tap(() => {
          //if (evt instanceof HttpResponse) {}
        }),
        catchError(error => {
          this.loadingService.setLoading(true, 'Error');

          return this.handleResponseError(error, request);
        }),
        this.urlsPermitidas.indexOf(request.url) === -1 ? retryWhen(genericRetryStrategy()) : finalize(() => {
          this.loadingService.setLoading(false, 'Error');
        }),
      )?.pipe(
        finalize(() => {
          this.loadingService.setLoading(false, 'Error');
        })
      )?.pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, 'Error');
        }
        return evt;
      }));
  }

  handleResponseError(error, request?): Observable<never> {
    if (this.urlsPermitidas.indexOf(request.url) === -1) {
      if (error?.error?.code === 'token_not_valid' || error?.error?.code === 'user_not_found') {
        this.tokenService.clearToken();
      }
    }
    
    if(error?.error?.descricao) 
      this.toastrService.mostrarToastrDanger(error?.error?.descricao ?? "Erro na requisição");

    return throwError((err) => error);
  }
}
