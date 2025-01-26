import { Component } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViaCepService } from 'src/app/shared/services/viaCep.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ProdutoService } from '../../produto/produto.service';
import { TokenService } from 'src/app/shared/services/token.service';

interface produto {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  valorTotalEdicao: number = 0;
  todosCliente: any = [];
  itemsClientes: any = [];

  itemsProdutos: any = [];
  todosProdutos: any = [];

  formPedido: FormGroup;
  idPedido: string;
  home: any;
  items: any[];

  precoTotalProdutos: number = 0;

  isMobile = window.innerWidth < 768;

  listaProdutos: produto[];

  passoAtual: number = 0;
  totalEditadoManualmente: boolean = false;
  parseFloat = parseFloat;

  itemsSteps = [
    {
        label: 'Cliente',    
    },
    {
        label: 'Produtos',
    },
    {
        label: 'Confirmação',
    }
  ];

  constructor(
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private viaCepService: ViaCepService,
    private produtoService: ProdutoService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute){

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Pedido' }, 
      { label: 'Cadastro' }
    ];

    this.home = { icon: 'pi pi-home'};

    this.formPedido = this.formBuilder.group({
      pedido_id: [null],
      cliente_id: [null, Validators.required],
      logradouro: [null],
      numero: [null, Validators.required],
      complemento: [null],
      bairro: [null],
      localidade: [null],
      uf: [null],
      cep: [null, Validators.required],
      itens: this.formBuilder.array([]),
      frete: [0],
      desconto: [0],
      total: [0],
    })

    this.formPedido.get('cliente_id').valueChanges.subscribe(cliente_id => {
      if(!cliente_id)
        this.formPedido.reset()
      
      const cliente = this.todosCliente.filter(item => item.id === cliente_id)
      if(cliente.length === 1)
        this.formPedido.patchValue({
          ...cliente[0],
          logradouro: cliente[0].rua,
          uf: cliente[0].estado,
          localidade: cliente[0].cidade,
        })
      
    })

    this.formPedido.get('cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => value && value.length === 8)
      )
      .subscribe(cep => {
        this.viaCepService.buscarCep(cep).subscribe(
          data => {
            this.formPedido.patchValue(data)
          },
          error => {
            console.error('Erro ao buscar o CEP:', error);
          }
        );
      });

    this.pedidoService.buscarDadosClientes().subscribe(
      (response) => {
        this.todosCliente = response.clientes;
        this.itemsClientes = response.clientes.map((item) => {
          return {
            value: item.id,
            label: item.nome_completo
          }
        })
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar clientes!');
      }
    );

    this.idPedido = this.activatedRoute.snapshot.paramMap.get('id');
    this.formPedido.patchValue({pedido_id: this.idPedido});

    if (this.idPedido) {
      this.formPedido.get('pedido_id').disable();
      this.buscarPedidoById(this.idPedido);
    }

    this.buscarDadosProdutos();
  }

  cadastrarPedido() {
    this.formPedido.markAllAsTouched();

    if (this.formPedido.valid) {
      const dados = {
        ...this.formPedido.getRawValue(),
        total: parseFloat(this.formPedido.get('total').value) + this.parseFloat(this.formPedido.get('frete').value),
        usuario_id: this.tokenService.getJwtDecodedAccess()?.user_id,
      }
      this.pedidoService.cadastrarPedido(dados).subscribe(
        (response) => {
          if (response.status) {
            this.toastrService.mostrarToastrSuccess('Pedido cadastrado com sucesso!');
            this.router.navigate(['/pedido/home']);
          } else {
            this.toastrService.mostrarToastrDanger(response.descricao);
          }
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao cadastrar pedido!');
        }
      );
    }
  }
  

  get itens(): FormArray {
    return this.formPedido.get('itens') as FormArray;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  onCepChange(): void {
    const cepValue = this.formPedido.get('cep')?.value;
    const cepOnlyNumbers = cepValue?.replace(/\D/g, '');
    if (cepOnlyNumbers && cepOnlyNumbers.length === 8) {
      this.viaCepService.buscarCep(cepOnlyNumbers).subscribe(
        data => {
          if(data.erro){
            this.formPedido.patchValue({
              logradouro: null,
              numero: null,
              complemento: null,
              bairro: null,
              localidade: null,
              uf: null,
            })
            this.toastrService.mostrarToastrDanger('Digite um CEP válido!')
          }else{
            this.formPedido.patchValue(data)
            this.formPedido.get('numero').setValue(null);
            this.formPedido.get('complemento').setValue(null);
          }
        },
        error => {
          console.error('Erro ao buscar o CEP:', error);
        }
      );
    }
  }

  buscarPedidoById(id: string): void {
    this.pedidoService.buscarPedidoById(id).subscribe({
      next: (dados) => {
        this.valorTotalEdicao = this.parseFloat(dados.pedidos.vlrTotal) - this.parseFloat(dados.pedidos.frete);
        this.formPedido.patchValue(dados.pedidos);
        this.formPedido.patchValue({
          cliente_id: dados.pedidos.cliente.id,
          total: this.valorTotalEdicao,
        }, { emitEvent: false });
        this.listaProdutos = dados.pedidos.produtos.forEach(item => {
          const novoProduto = this.formBuilder.group({
            produto_id: [item.produto_id, Validators.required],
            quantidade: [parseInt(item.quantidade), Validators.required],
            preco_unitario: [parseFloat(item.precoUnitario), Validators.required],
            is_estoque_externo: [item.is_estoque_externo],  
          });
          const itens = this.formPedido.get('itens') as FormArray;
          itens.push(novoProduto);
        });
        this.formPedido.get('total').setValue(dados.pedidos.vlrTotal);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar pedido');
      }
    })
  }

  buscarDadosProdutos(){
    this.produtoService.buscarDadosProdutos().subscribe(
      (response) => {
        this.todosProdutos = response.produtos;
        this.itemsProdutos = response.produtos
        .filter(item => item.status)
        .map((item) => {
          return {
            value: item.id,
            label: `${item.marca__nome} - ${item.nome}`
          }
        })
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar produtos!');
      }
    );
  }

  adicionarProduto() {
    const novoProduto = this.formBuilder.group({
      produto_id: [null, Validators.required],
      quantidade: [null, Validators.required],
      preco_unitario: [null, Validators.required],
      is_estoque_externo: [false],
    });
  
    const itens = this.formPedido.get('itens') as FormArray;
    itens.push(novoProduto);
  
    this.recalcularPrecoTotal();
    this.formPedido.updateValueAndValidity();
  }
  
  removerItemListaProduto(index: number) {
    const itens = this.formPedido.get('itens') as FormArray;
    itens.removeAt(index);
  
    this.recalcularPrecoTotal();
  }
  

  proximoPasso() {
    if (this.passoAtual === 0 && this.formPedido.get('cliente_id').value === null) {
      this.formPedido.markAllAsTouched();
      this.toastrService.mostrarToastrDanger('Selecione um cliente!');
      return;
    } else if (this.passoAtual === 1 && this.formPedido.get("itens").value.length === 0) {
      this.toastrService.mostrarToastrDanger('Adicione pelo menos um produto!');
      return;
    } else if (this.passoAtual === 2) {
      this.formPedido.markAllAsTouched();
      if (this.formPedido.valid) {
        this.cadastrarPedido();
      }
      return;
    }
  
    let produtosInvalidos = 0;
    this.itens.controls.forEach(item => {
      item.markAllAsTouched();
      if (item.invalid) {
        produtosInvalidos++;
      }
    });
  
    if (produtosInvalidos > 0) {
      this.toastrService.mostrarToastrDanger('Preencha todos os campos dos produtos!');
      return;
    }
  
    this.recalcularPrecoTotal(); // Atualiza o preço total antes de passar para o próximo passo
    this.passoAtual++;
  }
  

  passoAnterior() {
    this.precoTotalProdutos = 0;
    if(this.passoAtual === 0){
      this.router.navigate(['/pedido/home']);
      return;
    }
    this.passoAtual--;
  }

  buscarProduto(id: number){
    const produto = this.todosProdutos.find(item => item.id === id)
    return produto ? produto : null
  }

  onChangeSelectProduto(event, form){
    const produto = this.buscarProduto(event.value);
    form.get("preco_unitario").setValue(produto.preco_venda);

    this.recalcularPrecoTotal()
  }

  recalcularPrecoTotal() {
    const itens = this.formPedido.get('itens') as FormArray;
    const precoProdutos = itens.controls.reduce((total, item) => {
      const quantidade = item.get('quantidade')?.value || 0;
      const precoUnitario = item.get('preco_unitario')?.value || 0;
      return total + (quantidade * precoUnitario);
    }, 0);
  
    this.precoTotalProdutos = precoProdutos;
  
    // Se `valorTotalEdicao` existir e o total não foi editado manualmente, use `valorTotalEdicao`
    if (this.valorTotalEdicao && !this.totalEditadoManualmente) {
      this.formPedido.get('total')?.setValue(this.valorTotalEdicao.toFixed(2), { emitEvent: false });
    } else if (!this.totalEditadoManualmente) {
      // Atualiza o total com base nos produtos caso não tenha sido editado manualmente
      this.formPedido.get('total')?.setValue(this.precoTotalProdutos.toFixed(2), { emitEvent: false });
    }
  }
  
  
  onTotalChange(event: any) {
    const valorEditado = parseFloat(event.target.value || '0');
    if (!isNaN(valorEditado)) {
      this.totalEditadoManualmente = true;
      this.formPedido.get('total')?.setValue(valorEditado.toFixed(2), { emitEvent: false });
    } else {
      // Caso o valor seja inválido, restaure o valor calculado ou o valor de `valorTotalEdicao`
      this.toastrService.mostrarToastrDanger('Digite um valor válido para o total.');
      if (this.valorTotalEdicao) {
        this.formPedido.get('total')?.setValue(this.valorTotalEdicao.toFixed(2), { emitEvent: false });
      } else {
        this.formPedido.get('total')?.setValue(this.precoTotalProdutos.toFixed(2), { emitEvent: false });
      }
      this.totalEditadoManualmente = false;
    }
  }
  
  
}
