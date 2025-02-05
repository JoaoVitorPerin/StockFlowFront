import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { Page404Component } from './core/page-404/page-404.component';
import { RedefinirSenhaComponent } from './core/redefinir-senha/redefinir-senha.component';
import { MovimentacaoEstoqueComponent } from './modules/movimentacao-estoque/movimentacao-estoque.component';
import { SepararPedidoComponent } from './modules/separar-pedido/separar-pedido.component';

const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: AutenticacaoComponent
    },
    {
        path: 'redefinir-senha',
        component: RedefinirSenhaComponent
    },
    {
        path: '',
        component: AppLayoutComponent,
        data: { animationState: 'AppLayoutComponent' },
        canActivate: [AutenticacaoGuard],
        canActivateChild: [AutenticacaoGuard],
        children: [
            {
                path: 'user',
                loadChildren: () =>
                  import(
                    './modules/user/user.module'
                  ).then(m => m.UserModule)
            },
            {
                path: 'produto',
                loadChildren: () =>
                  import(
                    './modules/produto/produto.module'
                  ).then(m => m.ProdutoModule)
            },
            {
                path: 'pedido',
                loadChildren: () =>
                  import(
                    './modules/pedido/pedido.module'
                  ).then(m => m.PedidoModule)
            },
            {
              path: 'marca',
              loadChildren: () =>
                import(
                  './modules/marca/marca.module'
                ).then(m => m.MarcaModule)
            },
            {
                path: 'cliente',
                loadChildren: () =>
                  import(
                    './modules/cliente/cliente.module'
                  ).then(m => m.ClienteModule)
            },
            {
              path: 'dashboard',
              loadChildren: () =>
                import(
                  './modules/dashboard/dashboard.module'
                ).then(m => m.DashboardModule)
            },
            {
              path: 'separar-pedido',
              component: SepararPedidoComponent
            },
            {
                path: 'movimentacao-estoque',
                component: MovimentacaoEstoqueComponent
            },
            {
                path: '404',
                component: Page404Component
            },
            {
                path: '**',
                redirectTo: '404'
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        data: { animationState: 'FullPath' },
    },
];
  
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}