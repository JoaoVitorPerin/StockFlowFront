import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard {
    constructor(private tokenService: TokenService, private router: Router) {}

    canActivate(): Observable<boolean> {
      return this.tokenService.logout(this.tokenService.getToken().refresh).pipe(
        tap(() => {
          this.tokenService.clearToken();
          this.router.navigate(['/login']);
        })
      );
    }
}