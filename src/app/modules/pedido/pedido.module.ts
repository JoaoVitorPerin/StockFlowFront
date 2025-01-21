import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PedidoComponent } from './pedido.component';
import { HomeComponent } from './home/home.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepsModule } from 'primeng/steps';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    declarations: [
        PedidoComponent,
        HomeComponent,
        CadastroComponent
    ],
    imports: [
        CommonModule,
        FormModule,
        FormsModule,
        ReactiveFormsModule,
        DatagridModule,
        ButtonModule,
        CardModule,
        BreadcrumbModule,
        PedidoRoutingModule,
        DividerModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        StepsModule,
        CheckboxModule
    ],
})
export class PedidoModule {}
