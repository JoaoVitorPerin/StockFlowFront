import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formUser: FormGroup;
  idUsuario: string;
  itemsGrupos: any[] = [];
  items: any[];
  home: any;

  subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private userService: UserService,
              private activatedRoute: ActivatedRoute){
                this.formUser = this.formBuilder.group({
                  user_id: [null],
                  username: [null, Validators.required],
                  first_name: [null, Validators.required],
                  last_name: [null, Validators.required],
                  email: [null, [Validators.required, Validators.email]],
                  grupo_id: [null, Validators.required]
                })

                this.idUsuario = this.activatedRoute.snapshot.paramMap.get('id');
                this.formUser.patchValue({user_id: this.idUsuario});

                if (this.idUsuario) {
                  this.formUser.get('user_id').disable();
                  this.buscarUserById(this.idUsuario);
                }

                this.buscarGrupos();
                this.items = [
                  { label: 'Gestão Admin' }, 
                  { label: 'Usuários' }, 
                  { label: 'Cadastro' }
                ];
      
                this.home = { icon: 'pi pi-home'};
              }

  buscarUserById(id: string): void {
    this.subs.push(
      this.userService.buscarUserById(id).subscribe({
        next: (dados) => {
          this.formUser.patchValue(dados.usuario);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar usuário');
        }
      })
    );
  }

  cadastrarUser(): void {
    this.formUser.markAllAsTouched();
    console.log(this.formUser.getRawValue());
    if(this.formUser.valid){
      this.subs.push(
        this.userService.cadastrarUser(this.formUser.getRawValue()).subscribe({
          next: (response) => {
            this.toastrService.mostrarToastrSuccess(`Usuário ${this.idUsuario ? 'editado' : 'cadastrado'} com sucesso`);
            this.router.navigate(['user/home']);
          }, error: () => {
            this.toastrService.mostrarToastrDanger('Erro ao cadastrar usuário');
          }
        })
      );
    }
  }

  buscarGrupos(): void {
    this.subs.push(
      this.userService.buscarGrupos().subscribe({
        next: (dados) => {
          this.itemsGrupos = dados.grupos.map((grupo) => {
            return {label: grupo.name, value: grupo.id};
          });
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar grupos');
        }
      })
    );
  }
}
