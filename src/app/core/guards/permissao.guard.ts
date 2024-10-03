import { Observable, Subscription } from 'rxjs';
import { PermissaoService } from '../services/permissao.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PermissaoGuard  {
  private sub: Subscription;
  private pontoFuncaoSolicitado: string;

  constructor(private router: Router, private permissaoService: PermissaoService) {
  }

  private verificarPermissao(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {

    //TODO: adicionar verificação de permissão no local storage
    return true;

    const existeUrl$ = new Observable<boolean>(observer => {
      if (this.sub) {
        this.sub.unsubscribe();
      }
      this.pontoFuncaoSolicitado = activatedRoute.data.permissao;
      this.sub = this.permissaoService.solicitarPermissao([this.pontoFuncaoSolicitado])
        .subscribe(
          dados => {
            const permitido = dados.pf_liberados.indexOf(this.pontoFuncaoSolicitado) > -1 ? true : false;

            if (!permitido) {
              this.router.navigate(['403']);
            }

            observer.next(permitido);
            observer.complete();
          });
    });
    return existeUrl$;
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.verificarPermissao(activatedRoute);
  }

  canActivateChild(activatedRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.verificarPermissao(activatedRoute);
  }

  canLoad(): boolean {
    return false;
  }
}
