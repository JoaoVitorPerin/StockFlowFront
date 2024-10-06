import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard {
    constructor(private tokenService: TokenService, private router: Router) {}

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        
    return new Observable(observer => {
        const token = this.tokenService.getToken();
            if (token) {
                this.router.navigate(['/dashboard']);
                observer.next(false);
            }else {
                this.router.navigate(['/login']);
                observer.next(false);
            }
                observer.complete();
        });
    }
}