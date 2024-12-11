import { Component } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViaCepService } from 'src/app/shared/services/viaCep.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ProdutoService } from '../../produto/produto.service';

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
    private activatedRoute: ActivatedRoute){

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Pedido' }, 
      { label: 'Cadastro' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

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

  cadastrarPedido(){
    this.formPedido.markAllAsTouched();

    if(this.formPedido.valid){
      this.pedidoService.cadastrarPedido(this.formPedido.getRawValue()).subscribe(
        (response) => {
          if(response.status){
            this.toastrService.mostrarToastrSuccess('Pedido cadastrado com sucesso!');
            this.router.navigate(['/pedido/home']);
          }else{
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
        this.formPedido.patchValue(dados.pedidos);
        this.formPedido.patchValue({
          cliente_id: dados.pedidos.cliente.id,
          total: parseFloat(dados.pedidos.vlrTotal).toFixed(2),
        }, { emitEvent: false });
        this.listaProdutos = dados.pedidos.produtos.forEach(item => {
          const novoProduto = this.formBuilder.group({
            produto_id: [item.produto_id, Validators.required],
            quantidade: [parseInt(item.quantidade), Validators.required],
            preco_unitario: [parseFloat(item.precoUnitario), Validators.required],
          });
          this.precoTotalProdutos += parseInt(item.quantidade) * parseFloat(item.precoUnitario);
          const itens = this.formPedido.get('itens') as FormArray;
          itens.push(novoProduto);
        });
        this.formPedido.get('total').setValue(dados.pedidos.vlrTotal);
        console.log(this.formPedido.getRawValue())
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
            label: item.nome
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
    });
  
    const itens = this.formPedido.get('itens') as FormArray;
    itens.push(novoProduto);
  
    this.formPedido.updateValueAndValidity();
  }

  removerItemListaProduto(index: number) {
    const itens = this.formPedido.get('itens') as FormArray;
    itens.removeAt(index);
  }

  proximoPasso() {
    if(this.passoAtual === 0 && this.formPedido.get('cliente_id').value === null){
      this.formPedido.markAllAsTouched();
      this.toastrService.mostrarToastrDanger('Selecione um cliente!');
      return;
    }else if(this.passoAtual === 1 && this.formPedido.get("itens").value.length === 0){
      this.toastrService.mostrarToastrDanger('Adicione pelo menos um produto!');
      return;
    }else if(this.passoAtual === 2){
      this.formPedido.markAllAsTouched();
      if(this.formPedido.valid){
        this.formPedido.get('total').setValue(
          (this.precoTotalProdutos + parseFloat(this.formPedido.get('frete').value) - parseFloat(this.formPedido.get('desconto').value)).toFixed(2)
        );
        this.cadastrarPedido();
      }
      return
    }
    let produtosInvalidos = 0;
    this.itens.controls.forEach(item => {
      item.markAllAsTouched();
      if(item.invalid){
        produtosInvalidos++;
      }
    });

    if(produtosInvalidos > 0){
      this.toastrService.mostrarToastrDanger('Preencha todos os campos dos produtos!');
      return;
    }
    
    this.itens.controls.forEach(item => {
      const quantidade = item.get('quantidade').value;
      const precoUnitario = item.get('preco_unitario').value;
      this.precoTotalProdutos += quantidade * precoUnitario;
    });
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
}
