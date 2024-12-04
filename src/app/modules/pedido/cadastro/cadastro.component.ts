import { Component } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViaCepService } from 'src/app/shared/services/viaCep.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  todosCliente: any = [];
  itemsClientes: any = [];

  formPedido: FormGroup;
  idPedido: string;
  home: any;
  items: any[];

  constructor(
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private viaCepService: ViaCepService,
    private activatedRoute: ActivatedRoute){

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Pedido' }, 
      { label: 'Cadastro' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.formPedido = this.formBuilder.group({
      cliente_id: [null, Validators.required],
      logradouro: [null],
      numero: [null, Validators.required],
      complemento: [null],
      bairro: [null],
      localidade: [null],
      uf: [null],
      cep: [null, Validators.required],
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
  }

  cadastrarPedido(){
    console.log(this.formPedido.getRawValue())
  }

  onCepChange(): void {
    const cepValue = this.formPedido.get('cep')?.value;
    const cepOnlyNumbers = cepValue?.replace(/\D/g, '');
    if (cepOnlyNumbers && cepOnlyNumbers.length === 8) {
      this.viaCepService.buscarCep(cepOnlyNumbers).subscribe(
        data => {
          console.log(data)
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
          }
        },
        error => {
          console.error('Erro ao buscar o CEP:', error);
        }
      );
    } else {
      this.toastrService.mostrarToastrDanger('Digite um CEP válido!')
    }
  }
}
