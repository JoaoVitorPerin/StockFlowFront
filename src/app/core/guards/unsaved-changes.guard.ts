import { ModalFormularioAlteradoService } from 'src/app/shared/components/modal-formulario-alterado/modal-formulario-alterado.service';
import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UnsavedChangesService } from 'src/app/shared/services/unsaved-changes.service';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<any> {


  constructor(
    private unsavedChangesService: UnsavedChangesService,
    private modalFormularioAlteradoService: ModalFormularioAlteradoService
  ) {}

  canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.unsavedChangesService.hasUnsavedChanges()) {
      // this.unsavedChangesService.emitFormAlterado(true);
      // this.unsavedChangesService.setNextUrl(nextState.url);
      // this.modalFormularioAlteradoService.atualizarAbrirModal()
      // return this.unsavedChangesService.unsavedChangesEvent; // Retorna um observable do evento de alterações não salvas
      return true
    } else {
      return true;
    }
  }
}
