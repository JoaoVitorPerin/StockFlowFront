import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { HomeComponent } from './modules/home/home.component';
import { Page404Component } from './core/page-404/page-404.component';
import { RedefinirSenhaComponent } from './core/redefinir-senha/redefinir-senha.component';

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
                path: 'home',
                component: HomeComponent
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
  
export class AppRoutingModule {
    static routing: ModuleWithProviders<RouterModule> =
        RouterModule.forRoot(APP_ROUTES);
}