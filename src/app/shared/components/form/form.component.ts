import { Subscription, debounceTime } from 'rxjs';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { Component, Input, OnInit, EventEmitter, Output, ViewChild, OnChanges, ViewEncapsulation, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef, TemplateRef, HostListener } from '@angular/core';
import { items } from "../../models/items.model";
import * as dayjs from "dayjs"
import { OverlayPanel } from "primeng/overlaypanel";
import { Router } from '@angular/router';
import { inOutAnimation } from 'src/app/core/animations';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ToastrService } from '../toastr/toastr.service';
import { ModalService } from '../modal/modal.service';
import { formatarBytes } from '../../ts/util';

interface Image {
  name: string;
  objectURL: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],  
  animations: [inOutAnimation],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() label: string;
  @Input({required: true, }) type: string;
  @Input() formControlName: string;
  @Input() multiple: boolean;
  @Input() metaKeySelection: boolean;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() ajuda: string;
  @Input() customStyle: JSON;
  @Input() erro: string;
  @Input() icon: string;
  @Input() rows: number;
  @Input() min: number;
  @Input() max: number;
  @Input() prefix: string;
  @Input() mask: string;
  @Input() slotChar: string;
  @Input() items: Array<items>;
  @Input() itemsSelecionados: Array<items> = [];
  @Input() opcoesPesquisa: any[];
  @Input() placeholder: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() maxLength: number;
  @Input() grid: string;
  @Input() iconType: string;
  @Input() width: number|string;
  @Input() currency: string;
  @Input() value: any;
  @Input() textoAgrupamento: string;
  @Input() autoClear: boolean;
  @Input() loading: boolean;
  @Input() tipo: string;
  @Input() emptyTemplate: TemplateRef<any>
  @Input() exibirLabelObrigatoriedade: boolean
  @Input() accept: string
  @Input() context: any
  @Input() showButtons: boolean
  @Input() maxFileSize: number
  @Input() acceptFiles: boolean

  @Output() appEnterKey = new EventEmitter();
  @Output() filterEvent = new EventEmitter<string>();
  @Output() click = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() keyUp = new EventEmitter();
  @Output() keyDown = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() pesquisar = new EventEmitter();
  @Output() modelChange = new EventEmitter();
  @Output() uploadedFile = new EventEmitter();
  @Output() deletedFile = new EventEmitter();
  @Output() rangeSelected = new EventEmitter();

  @ViewChild('rangeData') private rangeData: any;
  @ViewChild('overlayPesquisa') overlayPesquisa: OverlayPanel;
  @ViewChild('inputPesquisa') inputPesquisa: any;

  formGroup: FormGroup
  dayjs = dayjs;
  minDateDefault: Date;
  maxDateDefault: Date;
  subs: Subscription[] = []
  customFeedback: any;

  @ViewChild('previewImagem') previewImagem: TemplateRef<any>;
  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
  @Output() uploadedFilesEvent = new EventEmitter<Image[]>();

  pathDiretorio: string = '';
  objArquivo: string = '';
  uploadedFiles: any[] = [];
  loadingUpload: boolean = false;


  constructor(
    private parentFormGroup: FormGroupDirective,
    private fileUploadService: FileUploadService,
    private toastrService: ToastrService,
    private modalService: ModalService,
    private router: Router,
  ){

    this.minDateDefault = new Date(this.dayjs().subtract(7, 'days').toDate())
    this.maxDateDefault = new Date('2100-12-31')

    this.customFeedback = {
      icon: {
          show: 'pi pi-eye', // Ícone quando a máscara está ativada
          hide: 'pi pi-eye-slash' // Ícone quando a máscara está desativada
      }
  };
  }

  ngOnInit(): void {
    this.pathDiretorio = this.router.url.split('/')[1]

    if(this.formControlName && this.parentFormGroup.form){
      this.formGroup = this.parentFormGroup.form
      this.formGroup.addControl(this.formControlName, new FormControl(''))
      if(this.required){
        this.formGroup?.get(this.formControlName)?.addValidators(Validators.required)
        this.formGroup?.updateValueAndValidity()
      }
      if(this.value){
        this.formGroup?.get(this.formControlName)?.setValue(this.value)
      }
    }

    this.subs.push(
      this.formGroup?.get(this.formControlName)?.valueChanges.subscribe(dados => {
        this.change.emit(dados)
      })
    )
    if(this.type == `file`){
      this.subs.push(this.formGroup.get(this.formControlName)?.valueChanges.pipe(debounceTime(100)).subscribe(dados => {
          if(Array.isArray(dados)){
            this.uploadedFiles = dados?.map(file => {
              return {
                nome: file?.nome,
                arquivo: file?.arquivo,
                tamanho: file?.tamanho
              }
            })
          }
        })
      )
      if(this.formGroup.get(this.formControlName)?.value){
        const value = this.formGroup.get(this.formControlName)?.value;
        this.uploadedFiles = Array.isArray(value) ? value : [value];
      }
    }

    if(this.type == `dualist`){
      if(this.formGroup.value[this.formControlName]?.length){
        this.itemsSelecionados = this.formGroup.value[this.formControlName]?.map(selecionado => {
          return this.items?.find(item => item.value == selecionado)
        })

        this.items = this.items.filter(item => {
          return !this.formGroup.value[this.formControlName].find(selecionado => {
            return selecionado == item.value
          })
        })
      }

      this.subs.push(this.formGroup.get(this.formControlName).valueChanges.pipe(debounceTime(100)).subscribe(dados => {
          this.itemsSelecionados = dados?.map(selecionado => {
            return this.items?.find(item => item.value == selecionado)
          })

          this.items = this.items?.filter(item => {
            return !dados.find(selecionado => {
              return selecionado == item.value
            })
          })
      }))
    }
  }

  ngOnChanges(): void {
    if (this.overlayPesquisa) {
      if (this.opcoesPesquisa.length) {
        this.overlayPesquisa.show(null, this.inputPesquisa.nativeElement)
      }else {
        this.overlayPesquisa.hide()
      }
    }
  }

  ngOnDestroy(): void {
    if(this?.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

  onClickHandler(ev): void {
    this.click.emit(ev)
  }

  onBlurHandler(ev): void {
    this.blur.emit(ev)
  }

  onChangeHandler(ev): void {
    this.change.emit(ev)
  }

  onKeyUpHandler(ev): void {
    this.keyUp.emit(ev)
  }

  onKeyDownHandler(ev): void {
    this.keyDown.emit(ev)
  }

  onPesquisaGenerica(ev): void {
    this.pesquisar.emit(ev)
  }

  onSelectDateRange(): void{
    if (this.formGroup?.get(this.formControlName)?.value?.length && this.formGroup?.get(this.formControlName)?.value[1]) {
      this.rangeData.overlayVisible=false;
      this.rangeSelected.emit(this.formGroup?.get(this.formControlName)?.value)
    }
  }

  selecionarOpcaoPesquisa(opcao) {
    this.formGroup.get(this.formControlName).setValue(opcao);
    if (this.overlayPesquisa) {
      this.overlayPesquisa.hide()
    }
  }

  onDualistChange() {
    this.formGroup.get(this.formControlName).setValue(this.itemsSelecionados.map(item => item?.value),
      {emitEvent: false});
  }

  onUpload(event: any, fileUploader: any, size?: number) {
    this.loadingUpload = true;
    if(event){
      event = [...event.files]
      if(!event?.length)
        return
      if(size){
        for(const file of event){
          if(file?.size > size){
            this.loadingUpload = false;
            return
          }
        }
      }
      for(const file of event){
        this.fileUpload([file])
      }
    }
  }

  fileUpload(file: Array<any>): void {
    const fileSizeOverpass = file?.some(item => item.size > this.maxFileSize);

    if(fileSizeOverpass) {
      this.loadingUpload = false;
      return
    } 

    this.fileUploadService.fileUpload(file, this.pathDiretorio, this.tipo).subscribe({
      next: (res) => {
        if(res.status){

          this.loadingUpload = false;

          this.uploadedFiles.push(res.url_arquivo);

          this.formGroup.get(this.formControlName)?.setValue(this.uploadedFiles, {emitEvent: false});
          this.onUploadedFile(this.uploadedFiles)

        } else {
          this.loadingUpload = false;
          this.toastrService.mostrarToastrDanger(res.descricao ?? 'Erro ao salvar arquivo!');
        }
      }, error: () => {
        this.loadingUpload = false;
        this.toastrService.mostrarToastrDanger('Erro ao salvar arquivo!');
      }
    });
  }

  deleteFile(event: Event, file: Image) {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.uploadedFilesEvent.emit(this.uploadedFiles);
    }
    this.onDeletedFile()
  }

  onUploadedFile(ev): void {
    this.uploadedFile.emit({upload: ev, ...this.context})
  }

  onDeletedFile(): void {
    this.deletedFile.emit({files: this.uploadedFiles, ...this.context})
  }

  onImageMouseOver(file: Image) {
    this.buttonEl.toArray().forEach(el => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = 'flex' : null;
    })
  }

  onImageMouseLeave(file: Image) {
    this.buttonEl.toArray().forEach(el => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = 'none' : null;
    })
  }

  previewImage(value): void {
    this.objArquivo = value
    this.modalService.abrirModal('Visualização de arquivo',this.previewImagem, [], {larguraDesktop: '80'});
  }

  downloadFile(file: any): void {
    this.fileUploadService.downloadFile(file, this.pathDiretorio, this.tipo).subscribe((res: any) => {
      if(res.status){
        window.open(`https://storage.googleapis.com/voai-publico/${res.path_intermediaria}` , '_blank');
        this.modalService.fecharModal()
      }else{
        this.toastrService.mostrarToastrDanger(res.descricao ?? 'Erro ao baixar arquivo!');
      }
    })
  }

  onFilter(event) {
    this.filterEvent.emit(event.filter);
  }

  @HostListener('window:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.appEnterKey.emit(event);
  }

  formatarBytes(bytes: number): string {
    return formatarBytes(bytes)
  }
}
