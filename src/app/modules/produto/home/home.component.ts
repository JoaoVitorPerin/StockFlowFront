import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { ProdutoService } from '../produto.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { TokenService } from 'src/app/shared/services/token.service';
import { formatarData } from 'src/app/shared/ts/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];
  formEstoque: FormGroup;
  formMarca: FormGroup;
  movimentacaoProduto: any = {};
  opcoesRadio: Array<items> = [];

  formatarData = formatarData;

  items: any[];
  home: any;

  @ViewChild('modalControleEstoque', { static: false }) modalControleEstoque!: TemplateRef<any>;
  @ViewChild('modalMarca', { static: false }) modalMarca!: TemplateRef<any>;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private produtoService: ProdutoService,
    private tokenService: TokenService,
    private modalService: ModalService,
    private formBuilder: FormBuilder
  ) {
    this.opcoesRadio = [
      {
        value: 'entrada',
        label: 'Entrada'
      },
      {
        value: 'saida',
        label: 'Saída'
      }
    ]

    this.formEstoque = this.formBuilder.group({
      usuario_id: [null],
      produto_id: [null],
      qtd_estoque: [null],
      movimentacao: [null, Validators.required],
      quantidade: [null, Validators.required],
    })

    this.formMarca = this.formBuilder.group({
      nome: [null, Validators.required]
    })

    this.columns = [
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'marca__nome',
        caption: 'Marca',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'estoque__quantidade',
        caption: 'Qtd. Estoque',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'preco_compra',
        caption: 'Preço de Compra',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiroUS',
      },
      {
        dataField: 'preco_compra_real',
        caption: 'Preço de Compra Real',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'preco_venda',
        caption: 'Preço de Venda',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'status',
        caption: 'Status',
        sorting: true,
        cellTemplate: 'boolean',
      },
      {
        dataField: 'acoes',
        caption: 'Ações',
        fixed: true,
        width: '100px',
      },
    ];

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-pencil',
      color: 'primary',
      tooltip: 'Editar Produto',
      click: (rowData): void => {
        this.router.navigate(['produto/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-times',
      color: 'danger',
      tooltip: 'Desativar Produto',
      show: (rowData): boolean => {
        return rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusProduto(rowData?.id);
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-check',
      color: 'success',
      tooltip: 'Ativar Produto',
      show: (rowData): boolean => {
        return !rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusProduto(rowData?.id);
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-sliders-h',
      color: 'info',
      tooltip: 'Controle de Estoque',
      click: (rowData): void => {
        this.movimentacaoProduto = {};
        this.formEstoque.reset();
        this.formEstoque.patchValue({
          usuario_id: this.tokenService.getJwtDecodedAccess()?.user_id,
          produto_id: rowData?.id,
          qtd_estoque: rowData?.estoque__quantidade ?? 0
        })
        this.movimentacaoProduto = {
          data: rowData.ultima_movimentacao_data ?? '',
          qtd: rowData.ultima_movimentacao_quantidade ?? '',
          tipo: rowData.ultima_movimentacao_tipo ?? '',
          nomeUsuario: `${rowData.ultima_movimentacao_usuario_nome ?? ''} ${rowData.ultima_movimentacao_usuario_sobrenome ?? ''}`
        }
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
              this.movimentarEstoque();
            }
          }
        ];
        this.modalService.abrirModal(`Controle de estoque - ${rowData.nome}`, this.modalControleEstoque, botoes);
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Produto',
        text: 'Produto',
        click: (): void => {
          this.router.navigate(['produto/cadastro']);
        }
      }
    )

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'info',
        tooltip: 'Adicionar Marca',
        text: 'Marca',
        click: (): void => {
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
                this.formMarca.markAllAsTouched();
                if (this.formMarca.invalid) {
                  return;
                }
                this.produtoService.cadastrarMarca(this.formMarca.value).subscribe(
                  (res) => {
                    if(res.status){
                      this.toastrService.mostrarToastrSuccess(`Marca cadastrada com sucesso`);
                      this.modalService.fecharModal();
                    }else{
                      this.toastrService.mostrarToastrDanger(res.descricao);
                    }
                  },
                  () => {
                    this.toastrService.mostrarToastrDanger('Erro ao cadastrar marca');
                  }
                );
              }
            }
          ];
        this.modalService.abrirModal(`Adicionar Marca`, this.modalMarca, botoes,{larguraDesktop: '50'});
        }
      }
    )

    this.items = [
      { label: 'Gestão Admin' }, 
      { label: 'Produtos' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home'};
  }

  ngOnInit(): void {
    this.buscarProdutos();
  }

  buscarProdutos(): void {
    this.produtoService.buscarDadosProdutos().subscribe(
      (response) => {
        this.data = response.produtos ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar produtos');
      }
    );
  }

  alterarStatusProduto(id: string): void {
    this.produtoService.alterarStatusProduto(id).subscribe(
      () => {
        this.toastrService.mostrarToastrSuccess(`Alterado status do produto com sucesso`);
        this.buscarProdutos();
      },
      () => {
        this.toastrService.mostrarToastrDanger('Erro ao alterar status do produto');
      }
    );
  }

  movimentarEstoque(): void {
    this.formEstoque.markAllAsTouched();
    if (this.formEstoque.invalid) {
      return;
    }

    this.produtoService.movimentarEstoque(this.formEstoque.getRawValue()).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.mostrarToastrSuccess(`Movimentação de estoque realizada com sucesso`);
          this.modalService.fecharModal();
          this.buscarProdutos();
        }else{
          this.toastrService.mostrarToastrDanger(res.descricao);
        }
      },
      () => {
        this.toastrService.mostrarToastrDanger('Erro ao movimentar estoque');
      }
    );
  }
}
