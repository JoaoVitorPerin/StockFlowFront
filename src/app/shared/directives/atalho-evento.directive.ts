import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appAtalhoEvento]',
  standalone: true
})
export class AtalhoEventoDirective {

  @Input('appAtalhoEvento') atalho: string | number | Array<string|number> ;
  @Input() ctrl: boolean;
  @Input() shift: boolean;
  @Input() alt: boolean;

  @Output() evento = new EventEmitter()

  @HostListener('window:keydown', ['$event'])
  handleAtalho(event: KeyboardEvent): void {
    /*
    * atalho pode ser uma string ou um array de strings. Caso seja uma string, verifica se o atalho é igual a tecla clicada. Se for uma lista de strings, verifica se a tecla clicada está dentro deste array de strings
    */
    const atalhoClicado = ((typeof(this.atalho) === 'string' || typeof(this.atalho) === 'number') && event.key == this.atalho) || (typeof(this.atalho) === 'object' && this.atalho.some((atalho) => atalho == event.key))
    if (atalhoClicado) {
      if(!this.ctrl && !this.shift && !this.alt && !event.ctrlKey && !event.shiftKey && !event.altKey){
        event.preventDefault()
        this.evento.emit(event.key);
      } else {
        if(this.ctrl && event.ctrlKey){
          event.preventDefault()
          this.evento.emit(event.key);
        } else if(this.shift && event.shiftKey){
          event.preventDefault()
          this.evento.emit(event.key);
        } else if(this.alt && event.altKey) {
          event.preventDefault()
          this.evento.emit(event.key)
        }
      }
    }
  }

}
