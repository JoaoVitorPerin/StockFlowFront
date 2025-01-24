import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            // {
            //     label: 'Módulos',
            //     items: [
            //         { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home'] }
            //     ]
            // },
            {
                label: 'Gestão Admin',
                items: [
                    { label: 'Usuários', icon: 'pi pi-fw pi-user', routerLink: ['/user/home'] },
                    { label: 'Produtos e Estoque', icon: 'pi pi-fw pi-box', routerLink: ['/produto/home'] },
                    { label: 'Marcas', icon: 'pi pi-fw pi-bookmark', routerLink: ['/marca/home'] },
                ]
            },
            {
                label: 'Estoque',
                items: [
                    { label: 'Movimentações', icon: 'pi pi-fw pi-arrows-v', routerLink: ['/movimentacao-estoque'] },
                ]
            },
            {
                label: 'Gestão de Pedidos',
                items: [
                    { label: 'Pedidos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pedido/home'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/cliente/home'] },
                ]
            },
        ];
    }
}
