import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoComponent } from './pedido.component';
import { HomeComponent } from './home/home.component';
import { CadastroComponent } from './cadastro/cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: PedidoComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'cadastro',
        component: CadastroComponent,
      },
      {
        path: 'cadastro/:id',
        component: CadastroComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
