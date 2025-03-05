import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { VendasCustosComponent } from './vendas-custos/vendas-custos.component';
import { CustoAtletaComponent } from './custo-atleta/custo-atleta.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'estoque',
        component: EstoqueComponent,
      },
      {
        path: 'vendas-custos',
        component: VendasCustosComponent,
      },
      {
        path: 'custo-atleta',
        component: CustoAtletaComponent,
      },
      {
        path: '',
        redirectTo: 'estoque',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
