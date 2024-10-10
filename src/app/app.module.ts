import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderService } from './core/interceptors/loader/loader.service';
import { ToastrModule } from './shared/components/toastr/toastr.module';
import { ModalModule } from './shared/components/modal/modal.module';
import { LoaderGeralComponent } from './shared/components/loader-geral/loader-geral.component';
import { TratamentoErrosService } from './core/interceptors/tratamento-erros/tratamento-erros.service';
import { ModalConfirmacaoModule } from './shared/components/modal-confirmacao/modal-confirmacao.module';

@NgModule({
    declarations: [
        AppComponent,
        LoaderGeralComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule.routing, 
        AppLayoutModule,
        AutenticacaoComponent,
        ToastrModule,
        HttpClientModule, 
        ModalModule,
        ModalConfirmacaoModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderService,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TratamentoErrosService,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
