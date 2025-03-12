import { CustoMensalService } from './../custo-mensal.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ProdutoService } from '../../produto/produto.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formCusto: FormGroup;
  idCusto: string;
  items: any[];
  marcas: any[] = [];
  home: any;

  anoAtual = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private custoMensalService: CustoMensalService,
              private activatedRoute: ActivatedRoute){
                this.formCusto = this.formBuilder.group({
                      custo_id: [null],
                      nome: [null, Validators.required],
                      valor: [null, Validators.required],
                      recorrente: [true],
                      data: [null]
                    })

                this.formCusto.get('recorrente').valueChanges.subscribe((value) => {
                  if(value){
                    this.formCusto.get('data').setValidators(Validators.required);
                  }else{
                    this.formCusto.get('data').clearValidators();
                    this.formCusto.get('data').reset();
                  }
                })

                this.idCusto = this.activatedRoute.snapshot.paramMap.get('id');
                this.formCusto.patchValue({custo_id: this.idCusto});

                if (this.idCusto) {
                  this.buscarCustoById(this.idCusto);
                }

                this.items = [
                  { label: 'Gestão Admin' }, 
                  { label: 'Custo mensal' }, 
                  { label: 'Cadastro' }
                ];
      
                this.home = { icon: 'pi pi-home'};
                }

  buscarCustoById(id: string): void {
    this.custoMensalService.buscarCustoById(id).subscribe({
      next: (dados) => {
        this.formCusto.patchValue(dados.custos);
        this.formCusto.get('data').setValue(dados.custos.dat_ini && dados.custos.dat_fim ? [new Date(dados.custos.dat_ini), new Date(dados.custos.dat_fim)] : null);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar custo');
      }
    })
  }

  cadastrarCusto(): void {
    this.formCusto.markAllAsTouched();

    if(!this.formCusto.get('recorrente').value && !this.formCusto.get('data').value){
      this.toastrService.mostrarToastrDanger('Preencha o período do custo!');
    }

    const data = {
      ...this.formCusto.getRawValue(),
      dat_ini: this.formCusto.get('data').value[0] ?? '',
      dat_fim: this.formCusto.get('data').value[1] ?? ''
    }

    if(this.formCusto.valid){
      this.custoMensalService.cadastrarCusto(data).subscribe({
        next: (response) => {
          this.toastrService.mostrarToastrSuccess(`Custo ${this.idCusto ? 'editada' : 'cadastrada'} com sucesso`);
          this.router.navigate(['custo-mensal/home']);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao cadastrar custo');
        }
      })
    }
  }
}
