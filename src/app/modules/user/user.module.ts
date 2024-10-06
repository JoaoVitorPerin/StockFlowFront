import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { UserRoutingModule } from './user-routing.module';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';

@NgModule({
    declarations: [
        UserComponent,
        CadastroComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        FormModule,
        ReactiveFormsModule,
        UserRoutingModule,
        DatagridModule
    ],
})
export class UserModule {}
