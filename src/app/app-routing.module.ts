import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';

const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: AutenticacaoComponent
    },
    {
        path: '',
        component: AppLayoutComponent,
        data: { animationState: 'AppLayoutComponent' },
        canLoad: [AutenticacaoGuard],
        canActivateChild: [AutenticacaoGuard],
        children: [
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