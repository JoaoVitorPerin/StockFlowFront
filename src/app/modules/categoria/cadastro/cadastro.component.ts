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
  formCategoria: FormGroup;
  idCategoria: string;
  items: any[];
  marcas: any[] = [];
  home: any;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private produtoService: ProdutoService,
              private activatedRoute: ActivatedRoute){
                this.formCategoria = this.formBuilder.group({
                      categoria_id: [null],
                      nome: [null, Validators.required]
                    })

                this.idCategoria = this.activatedRoute.snapshot.paramMap.get('id');
                this.formCategoria.patchValue({categoria_id: this.idCategoria});

                if (this.idCategoria) {
                  this.formCategoria.get('categoria_id').disable();
                  this.buscarCategoriasById(this.idCategoria);
                }

                this.items = [
                  { label: 'Gestão Produto' }, 
                  { label: 'Categorias' }, 
                  { label: 'Cadastro' }
                ];
      
                this.home = { icon: 'pi pi-home'};
                }

  buscarCategoriasById(id: string): void {
    this.produtoService.buscarCategoriaById(id).subscribe({
      next: (dados) => {
        this.formCategoria.patchValue(dados.categorias);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar categoria');
      }
    })
  }

  cadastrarCategoria(): void {
    this.formCategoria.markAllAsTouched();
    if(this.formCategoria.valid){
      this.produtoService.cadastrarCategoria(this.formCategoria.getRawValue()).subscribe({
        next: (response) => {
          this.toastrService.mostrarToastrSuccess(`Categoria ${this.idCategoria ? 'editada' : 'cadastrada'} com sucesso`);
          this.router.navigate(['categoria/home']);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao cadastrar categoria');
        }
      })
    }
  }
}
