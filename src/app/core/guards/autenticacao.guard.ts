import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard  {

  readonly API_BACK: string = environment.API_BACK

  constructor(private tokenService: TokenService, private router: Router, private route: ActivatedRoute) { }

  private verificacaoLogin(): Observable<boolean> {
    const accessToken = this.tokenService.getJwtDecodedAccess();
    const refreshToken = this.tokenService.getJwtDecodedRefresh();
    const date = new Date().getTime() / 1000;

    if (accessToken && refreshToken) {
      if (accessToken.exp < date && refreshToken.exp > date) {
        const tokenRefreshStorage = this.tokenService.getToken().refresh;
        return this.tokenService.enviarRefreshToken(tokenRefreshStorage).pipe(
          map((res) => {
            this.tokenService.clearToken();
            this.tokenService.setToken(res);
            return true;
          }),
          catchError(() => {
            this.tokenService.clearToken();
            this.redirectParaLogin(); // Redirect to login page
            return of(false);
          })
        );
      } else if (refreshToken.exp < date) {
        this.tokenService.clearToken();
        this.redirectParaLogin() // Redirect to login page
        return of(false);
      }
      return of(true);
    } else {
      this.tokenService.clearToken();
      this.redirectParaLogin() // Redirect to login page
      return of(false);
    }
  }

  redirectParaLogin(): void {
    this.router.navigate(['/login'])
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean{
    return this.verificacaoLogin()
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean{
    return this.verificacaoLogin()
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean{
    return this.verificacaoLogin()
  }
}
