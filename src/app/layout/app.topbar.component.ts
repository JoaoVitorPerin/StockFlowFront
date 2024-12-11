import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TokenService } from '../shared/services/token.service';
import { CotacaoService } from '../shared/services/cotacao.service';
import { toLocaleFixed } from '../shared/ts/util';
import { ModalService } from '../shared/components/modal/modal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from '../shared/components/toastr/toastr.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    nomeUsuario = 'Usuário Teste';
    items!: MenuItem[];
    cotacaoAtual = 0;
    formCotacao: FormGroup;

    isMobile = window.innerWidth <= 1024;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    toLocaleFixed = toLocaleFixed;
    @ViewChild('modalEditarCotacao', { static: false }) modalEditarCotacao!: TemplateRef<any>;

    constructor(
        public layoutService: LayoutService,
        private tokenService: TokenService,
        private cotacaoService: CotacaoService,
        private modalService: ModalService,
        private formBuilder: FormBuilder,
        private toastrService: ToastrService,
    ) {
        this.formCotacao = this.formBuilder.group({
            cotacao: [null],
        })

        this.nomeUsuario = `${this.tokenService.getJwtDecodedAccess().first_name} ${this.tokenService.getJwtDecodedAccess().last_name}`;

        this.buscarCotacao();
    }

    buscarCotacao() {
        this.cotacaoService.buscarDadoCotacao().subscribe(
            (data) => {
                this.cotacaoAtual = data.cotacao.valor ?? 0;
                this.formCotacao.get('cotacao')?.setValue(this.cotacaoAtual);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    editarCotacao() {
        const botoes = [
            {
              label: 'Cancelar',
              color: 'primary',
              link: true,
              onClick: () => {
                this.modalService.fecharModal();
              },
            },
            {
              label: 'Salvar',
              color: 'primary',
              onClick: () => {
                this.salvarCotacao();
              }
            }
          ];
        this.modalService.abrirModal(`Editar cotação`, this.modalEditarCotacao, botoes,{larguraDesktop: '20'});
    }

    salvarCotacao() {
        this.cotacaoService.cadastrarCotacao(this.formCotacao.value).subscribe(
            (data) => {
                if(data.status){
                    this.cotacaoAtual = this.formCotacao.get('cotacao')?.value;
                    this.modalService.fecharModal();
                }else{
                    this.toastrService.mostrarToastrDanger("Erro ao salvar cotação");
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
