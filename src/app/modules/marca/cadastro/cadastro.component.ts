import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ProdutoService } from '../../produto/produto.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formMarca: FormGroup;
  idMarca: string;
  items: any[];
  marcas: any[] = [];
  home: any;

  subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private produtoService: ProdutoService,
              private activatedRoute: ActivatedRoute){
                this.formMarca = this.formBuilder.group({
                      marca_id: [null],
                      nome: [null, Validators.required]
                    })

                this.idMarca = this.activatedRoute.snapshot.paramMap.get('id');
                this.formMarca.patchValue({marca_id: this.idMarca});

                if (this.idMarca) {
                  this.formMarca.get('marca_id').disable();
                  this.buscarMarcasById(this.idMarca);
                }

                this.items = [
                  { label: 'Gestão Produto' }, 
                  { label: 'Marcas' }, 
                  { label: 'Cadastro' }
                ];
      
                this.home = { icon: 'pi pi-home'};
                }

  buscarMarcasById(id: string): void {
    this.subs.push(
      this.produtoService.buscarMarcaById(id).subscribe({
        next: (dados) => {
          this.formMarca.patchValue(dados.marcas);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar marca');
        }
      })
    )
  }

  cadastrarMarca(): void {
    this.formMarca.markAllAsTouched();
    if(this.formMarca.valid){
      this.subs.push(
        this.produtoService.cadastrarMarca(this.formMarca.getRawValue()).subscribe({
          next: (response) => {
            this.toastrService.mostrarToastrSuccess(`Marca ${this.idMarca ? 'editada' : 'cadastrada'} com sucesso`);
            this.router.navigate(['marca/home']);
          }, error: () => {
            this.toastrService.mostrarToastrDanger('Erro ao cadastrar marca');
          }
        })
      )
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
