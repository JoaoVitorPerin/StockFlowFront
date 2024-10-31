import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TokenService } from '../shared/services/token.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    nomeUsuario = 'Usuário Teste';
    items!: MenuItem[];

    isMobile = window.innerWidth <= 1024;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private tokenService: TokenService
    ) {
        this.nomeUsuario = `${this.tokenService.getJwtDecodedAccess().first_name} ${this.tokenService.getJwtDecodedAccess().last_name}`;
    }
}
