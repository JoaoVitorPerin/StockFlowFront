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

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private custoMensalService: CustoMensalService,
              private activatedRoute: ActivatedRoute){
                this.formCusto = this.formBuilder.group({
                      custo_id: [null],
                      nome: [null, Validators.required],
                      valor: [null, Validators.required],
                      recorrente: [null],
                      anomes: [null]
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
        this.formCusto.patchValue(dados.marcas);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar custo');
      }
    })
  }

  cadastrarCusto(): void {
    this.formCusto.markAllAsTouched();
    const data = {
      ...this.formCusto.getRawValue()
    }

    if(!this.formCusto.get('recorrente').value){
      data.anomes = new Date().toISOString().slice(0, 7).replace('-', '')
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
