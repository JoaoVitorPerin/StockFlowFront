import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { EstoqueComponent } from './estoque/estoque.component';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { VendasCustosComponent } from './vendas-custos/vendas-custos.component';
import { CustoAtletaComponent } from './custo-atleta/custo-atleta.component';
import { CardDashboardComponent } from 'src/app/shared/components/card-dashboard/card-dashboard.component';

@NgModule({
    declarations: [
        EstoqueComponent,
        VendasCustosComponent,
        CustoAtletaComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FormModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        DatagridModule,
        ButtonModule,
        CardModule,
        BreadcrumbModule,
        ChartModule,
        CardDashboardComponent
    ],
})
export class DashboardModule {}
