import { TemplateRef } from "@angular/core";

export interface DatagridConfig {
    name: string;
    resizableColumns: boolean;
    paginator: boolean;
    rows: number;
    search: boolean;
    customButtons: CustomButton[];
    actionButtons: ActionButton[];
    exportButton: boolean;
    clearFilterButton: boolean;
    lazyLoadOnInit: boolean;
    header: boolean;
    customSearch?: boolean;
    groupRowsBy?: string
    addRow?: boolean,
    deleteRow?: boolean
    selectionMode: boolean;
    advancedFilter: boolean;
    urlLazyLoad?: string;
    searchTemplate?: TemplateRef<any> | null;
    backgroundColor?: (data) => void
    rowClick?: (data) => void
    refresh?: () => void
}

interface CustomButton {
    icon: string;
    iconType?: 'material' | 'prime';
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
    outlined?: boolean
    tooltip?: string;
    text?: string;
    deleteRow?: boolean;
    show?: (rowData) => boolean
    click: (selectedRows: Array<any>) => void;
}

interface ActionButton {
  icon: string;
  iconType?: 'material' | 'prime';
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  outlined?: boolean
  tooltip?: string;
  text?: string;
  deleteRow?: boolean;
  show?: (rowData) => boolean
  click: (rowData) => void;
}

export const datagridConfigDefault = () => {
    const configuracao: DatagridConfig = {
        name: 'Tabela',
        resizableColumns: true,
        paginator: true,
        rows: 10,
        search: true,
        customButtons: [],
        actionButtons: [],
        clearFilterButton: true,
        exportButton: true,
        lazyLoadOnInit: true,
        header: true,
        customSearch: false,
        addRow: false,
        deleteRow: false,
        selectionMode: false,
        advancedFilter: false,
        urlLazyLoad: null,
    }

    return configuracao;
}
