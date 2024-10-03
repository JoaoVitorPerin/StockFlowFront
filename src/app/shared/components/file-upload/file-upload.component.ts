import { AdminComunicadosService } from './../../../modules/admin-comunicados/admin-comunicados.service';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren, forwardRef } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { inOutAnimation } from 'src/app/core/animations';
import { ToastrService } from '../toastr/toastr.service';
import { Router } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatarBytes } from '../../ts/util';


interface Image {
  name: string;
  objectURL: string;
}
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  animations: [inOutAnimation],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor{

  readonly API_BACKEND = environment.API_BACK

  @Input() multiple: boolean;
  @Input() accept: string = null;
  @Input() tipo: string
  @Input() invalid: boolean
  @Input() maxFileSize: number

  loading: boolean = false;
  isPrivado: boolean = false;

  private files: any[] = [];
  onChange: any = () => {};
  onTouched: any = () => {};

  @Output() uploadedFilesEvent = new EventEmitter<Image[]>();

  uploadedFiles: any[] = [];
  pathDiretorio: string = '';
  objArquivo: string = '';
  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
  @ViewChild('previewImagem') previewImagem: TemplateRef<any>;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private modalService: ModalService,
    private fileUploadService: FileUploadService,
    private adminComunicadosService: AdminComunicadosService
  ) { }

  writeValue(value: any[]): void {
    if (value?.length) {
      this.files = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.pathDiretorio = this.router.url.split('/')[1]
    this.adminComunicadosService.pathDaImagemChanged.subscribe((listaArquivos: any) => {
      this.uploadedFiles = listaArquivos;
    });
  }

  onUpload(event: any, fileUploader: any, size?: number) {

    if(this.accept && this.accept !== 'image/*'){
      try {
        const uploadFiles = [...event.files]
        if(uploadFiles?.length){
          for(const file of uploadFiles){
            if(('.' + file?.name?.split('.')[file?.name?.split('.')?.length - 1]) != this.accept){
              this.toastrService.mostrarToastrDanger(`Insira um arquivo com a extensão ${this.accept} para prosseguir`)
              this.loading = false;
              return
            }
          }
        }
      } catch (error) {
        this.toastrService.mostrarToastrDanger(`Insira um arquivo com a extensão ${this.accept} para prosseguir`)
        this.loading = false;
        return
      }
    }

    this.loading = true;

    if(event){

      const uploadFiles = [...event.files]

      if(size){
        for(const file of uploadFiles){
          if(file?.size > size){
            this.loading = false;
            return
          }
        }
      }

      if(this.accept === '.xlsx' || this.accept === '.xls'){
        const reader = new FileReader();
        reader.onload = (e) => {

          const data = new Uint8Array((e.target as any).result);

          let workbook = null

          try {
            workbook = XLSX.read(data, {type: 'array'});
          } catch (error) {
            this.toastrService.mostrarToastrDanger('Insira um arquivo .xlsx ou .xls para prosseguir')
            this.loading = false;
            return
          }

          if(!workbook)
            return

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

          const colunas = [];
          const dados = [];

          jsonData.forEach((row: any, rowIndex) => {
            // Verifica se a linha tem algum valor
            if (row.some(r => r !== null && r !== undefined && r !== '')) {
              if (rowIndex === 0) {
                row.forEach((r, i) => {
                  colunas.push({
                    index: i,
                    coluna: r,
                  });
                });
              } else {
                const obj = {};
                row.forEach((r, i) => {
                  const _coluna = colunas.find((col) => col.index === i);
                  if (_coluna) {
                    obj[_coluna.coluna] = r;
                  }
                });
                dados.push(obj);
              }
            }
          });

          this.loading = false;
          this.toastrService.mostrarToastrSuccess('Arquivo lido com sucesso!');
          this.files = Array.from([{nome: uploadFiles[0].name, dados: dados, tamanho: uploadFiles[0].size, tipo: uploadFiles[0].type}]);
          this.onChange(this.files);
          this.uploadedFilesEvent.emit(this.files);
        };
        reader.readAsArrayBuffer(uploadFiles[0]);
      } else {
        this.fileUploadService.fileUpload(uploadFiles, this.pathDiretorio, this.tipo).subscribe((res: any) => {
          if(res.status){
            this.loading = false;
            this.toastrService.mostrarToastrSuccess('Arquivo salvo com sucesso!');
            if (res.url_arquivo?.arquivo?.includes('voai-privado')) {
              this.isPrivado = true;
            } else if (res.url_arquivo?.arquivo.includes('voai-publico')) {
              this.isPrivado = false;
            }
            this.files.push(res.url_arquivo);
            this.onChange(this.files);
            this.uploadedFilesEvent.emit(this.files);
            this.loading = false;
          }else{
            this.loading = false;
            this.toastrService.mostrarToastrDanger(res.descricao ?? 'Erro ao salvar arquivo!');
          }
        });
      }
    }
  }

  deleteFile(event: Event, file: Image) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
      this.uploadedFilesEvent.emit(this.files);
    }
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
    this.objArquivo = value;
    const botoes = [
    ]
  this.modalService.abrirModal('Visualização de arquivo',this.previewImagem, botoes, {larguraDesktop: '80'});

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

  formatarBytes(bytes: number): string {
    return formatarBytes(bytes)
  }

}
