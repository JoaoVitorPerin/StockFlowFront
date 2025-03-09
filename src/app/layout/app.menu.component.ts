import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { TokenService } from '../shared/services/token.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private tokenService: TokenService
    ) { }

    ngOnInit() {
        const permissoes = this.tokenService.getPermissions()
        
        if(permissoes.includes('Administrador')) {
            this.model.push(
                {
                    label: 'Dashboard',
                    items: [
                        { label: 'Estoque', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/estoque'] },
                        { label: 'Vendas e custos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/vendas-custos'] },
                        { label: 'Atletas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/custo-atleta'] },
                    ]
                }
            )
        }

        if(permissoes.includes('Operador de Estoque') || permissoes.includes('Administrador') || permissoes.includes('Operador de Pedidos')) {
            this.model.push(
                {
                    label: 'Gestão de Pedidos',
                    items: [
                        { label: 'Pedidos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pedido/home'] },
                        { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/cliente/home'] },
                        { label: 'Separação', icon: 'pi pi-fw pi-truck', routerLink: ['/separar-pedido'] },
                    ]
                }
            )
        }

        if(permissoes.includes('Administrador')) {
            this.model.push(
                {
                    label: 'Estoque',
                    items: [
                        { label: 'Movimentações', icon: 'pi pi-fw pi-arrows-v', routerLink: ['/movimentacao-estoque'] },
                    ]
                }
            )
        }

        if(permissoes.includes('Administrador')) {
            this.model.push(
                {
                    label: 'Gestão Produto',
                    items: [
                        { label: 'Produtos e Estoque', icon: 'pi pi-fw pi-box', routerLink: ['/produto/home'] },
                        { label: 'Marcas', icon: 'pi pi-fw pi-bookmark', routerLink: ['/marca/home'] },
                        { label: 'Categorias', icon: 'pi pi-fw pi-list', routerLink: ['/categoria/home'] },
                    ]
                }
            )
        }

        if(permissoes.includes('Administrador')) {
            this.model.push(
                {
                    label: 'Gestão Admin',
                    items: [
                        { label: 'Usuários', icon: 'pi pi-fw pi-user', routerLink: ['/user/home'] },
                        { label: 'Custo mensal', icon: 'pi pi-fw pi-dollar', routerLink: ['/custo-mensal/home'] }
                    ]
                },
            )
        }
    }
}
