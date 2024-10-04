import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { HomeComponent } from './modules/home/home.component';

const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: AutenticacaoComponent
    },
    {
        path: '',
        component: AppLayoutComponent,
        data: { animationState: 'AppLayoutComponent' },
        canActivate: [AutenticacaoGuard],
        canActivateChild: [AutenticacaoGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent
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