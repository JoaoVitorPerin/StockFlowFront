import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MarcaRoutingModule } from './marca-routing.module';
import { MarcaComponent } from './marca.component';

@NgModule({
    declarations: [
        MarcaComponent,
        CadastroComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        FormModule,
        FormsModule,
        ReactiveFormsModule,
        MarcaRoutingModule,
        DatagridModule,
        ButtonModule,
        CardModule,
        BreadcrumbModule
    ],
})
export class MarcaModule {}
