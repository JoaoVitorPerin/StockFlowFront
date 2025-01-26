import { AbstractControl, FormGroup, UntypedFormArray, ValidatorFn, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import { EMPTY } from 'rxjs';

export type FuzzyScore = number;

export interface FuzzySegment {
	value: string;
	isMatch: boolean;
}

export class FuzzyMatcher {
	public static parseValue( value: string, input: string ) : FuzzySegment[] {
		var valueLength = value.length;
		var inputLength = input.length;
		var valueIndex = 0;
		var inputIndex = 0;
		var segments: FuzzySegment[] = [];
		var segment: FuzzySegment;

		while ( valueIndex < valueLength ) {

			var valueChar = value.charAt( valueIndex++ ).toString().toLowerCase();
			var inputChar = input.charAt( inputIndex ).toString().toLowerCase();

			if ( valueChar === inputChar ) {
				inputIndex++;
				if ( segment && segment.isMatch ) {
					segment.value += valueChar;
				} else {
					segment = {
						value: valueChar,
						isMatch: true
					};
					segments.push( segment );
				}
				if ( ( inputIndex === inputLength ) && ( valueIndex < valueLength ) ) {
					segments.push({
						value: value.slice( valueIndex ),
						isMatch: false
					});
					break;
				}
			} else {
				if ( segment && ! segment.isMatch ) {
					segment.value += valueChar;
				} else {
					segment = {
						value: valueChar,
						isMatch: false
					};
					segments.push( segment );
				}
			}
		}
		return( segments );
	}

	public static scoreValue( value: string, input: string ) : FuzzyScore {
		var normalizedValue = slugify(value?.toString()?.toLowerCase()?.replace(/\s/g, ""));
		var normalizedInput = slugify(input?.toString()?.toLowerCase()?.replace(/\s/g, ""));
		var valueLength = normalizedValue?.length;
		var inputLength = normalizedInput?.length;
		var valueIndex = 0;
		var inputIndex = 0;
		var previousIndexMatched = false;
		var score = 0;
		while ( valueIndex < valueLength ) {
			var valueChar = normalizedValue?.charAt( valueIndex++ ); // Get and increment.
			var inputChar = normalizedInput?.charAt( inputIndex );
      if ( valueChar === inputChar ) {
				inputIndex++;
				score += ( previousIndexMatched ) ? 10 : 4;
				previousIndexMatched = true;
				if ( inputIndex === inputLength ) {
					return( score -= ( valueLength - valueIndex ) );
				}
			} else {
				score -= 2;
				previousIndexMatched = false;
			}
		}
		return( score );
	}
}

// toLocaleFixed
export const toLocaleFixed = (n: any, numero?: number): any => {
  if (typeof parseFloat(n) === 'number') {
    return (
      parseFloat(n).toLocaleString('pt-BR', {
        minimumFractionDigits: numero ?? 2,
        maximumFractionDigits: numero ?? 2,
      })
    );
  } else {
    return n;
  }
};

// formatação de data
export const paraDataDiaMes = (n: any): any => {
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      return dia + '/' + mes;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const pegarPrimeiroDiaMes = () => {
  let dataAtual: any  = new Date();
  dataAtual.setDate(1);
  dataAtual = dayjs(dataAtual).format("YYYY-MM-DD")
  return dataAtual;
}

export const pegarUltimoDiaMes = () => {
  let dataAtual: any = new Date();
  let proximoMes = new Date(dataAtual);
  proximoMes.setMonth(proximoMes.getMonth() + 1);
  proximoMes.setDate(0);
  dataAtual = dayjs(proximoMes).format("YYYY-MM-DD")
  return dataAtual;
}

// formatação de data
export const paraData = (n: any): any => {
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      return dia + '/' + mes + '/' + ano;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

// formatação de data
export const paraMes = (n: any): any => {
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      return mes + '/' + ano;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const paraDataTempo = (n: any, fusoHorario?: number): any => {
  if (!fusoHorario) {
    fusoHorario = 3;
  }
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0),
        parseInt(n.substring(11, 13), 0) - fusoHorario,
        parseInt(n.substring(14, 16), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      const horas =
        novaData.getHours().toString().length === 1
          ? '0' + novaData.getHours().toString()
          : novaData.getHours().toString();
      const minutos =
        novaData.getMinutes().toString().length === 1
          ? '0' + novaData.getMinutes().toString()
          : novaData.getMinutes().toString();

      return dia + '/' + mes + '/' + ano + ' às ' + horas + ':' + minutos;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const anoMesDiaParaData = (AAAAMMDD): any => {
  try {
    if (AAAAMMDD && AAAAMMDD.substring) {
      const ano = AAAAMMDD.substring(0, 4);
      const mes = AAAAMMDD.substring(4, 6);
      const dia = AAAAMMDD.substring(6, 8);

      return dia + '/' + mes + '/' + ano;
    } else {
      return AAAAMMDD;
    }
  } catch (erro) {
    return AAAAMMDD;
  }
};

export const paraDataTempoNGX = (n: any, fusoHorario?: number): any => {
  if (!fusoHorario) {
    fusoHorario = 3;
  }
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0),
        parseInt(n.substring(11, 13), 0) - fusoHorario,
        parseInt(n.substring(14, 16), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      const horas =
        novaData.getHours().toString().length === 1
          ? '0' + novaData.getHours().toString()
          : novaData.getHours().toString();
      const minutos =
        novaData.getMinutes().toString().length === 1
          ? '0' + novaData.getMinutes().toString()
          : novaData.getMinutes().toString();

      return novaData;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const paraAnomesdia = (n: any, fusoHorario?: number): any => {
  if (!fusoHorario) {
    fusoHorario = 3;
  }
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0),
        parseInt(n.substring(11, 13), 0) - fusoHorario,
        parseInt(n.substring(14, 16), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      const horas =
        novaData.getHours().toString().length === 1
          ? '0' + novaData.getHours().toString()
          : novaData.getHours().toString();
      const minutos =
        novaData.getMinutes().toString().length === 1
          ? '0' + novaData.getMinutes().toString()
          : novaData.getMinutes().toString();

      return ano + mes + dia;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const paraAnomesdiaTempo = (n: any, fusoHorario?: number): any => {
  if (!fusoHorario) {
    fusoHorario = 3;
  }
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0),
        parseInt(n.substring(11, 13), 0) - fusoHorario,
        parseInt(n.substring(14, 16), 0)
      );

      const dia =
        novaData.getDate().toString().length === 1
          ? '0' + novaData.getDate().toString()
          : novaData.getDate().toString();

      const mes =
        (novaData.getMonth() + 1).toString().length === 1
          ? '0' + (novaData.getMonth() + 1).toString()
          : (novaData.getMonth() + 1).toString();

      const ano =
        novaData.getFullYear().toString().length === 1
          ? '0' + novaData.getFullYear().toString()
          : novaData.getFullYear().toString();

      const horas =
        novaData.getHours().toString().length === 1
          ? '0' + novaData.getHours().toString()
          : novaData.getHours().toString();
      const minutos =
        novaData.getMinutes().toString().length === 1
          ? '0' + novaData.getMinutes().toString()
          : novaData.getMinutes().toString();

      return ano + mes + dia + ' ' + horas + ':' + minutos;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const paraTempo = (n: any): any => {
  try {
    if (n && n.substring) {
      const novaData = new Date(
        parseInt(n.substring(0, 4), 0),
        parseInt(n.substring(5, 7), 0) - 1,
        parseInt(n.substring(8, 10), 0),
        parseInt(n.substring(11, 13), 0) - 3,
        parseInt(n.substring(14, 16), 0)
      );

      const horas =
        novaData.getHours().toString().length === 1
          ? '0' + novaData.getHours().toString()
          : novaData.getHours().toString();
      const minutos =
        novaData.getMinutes().toString().length === 1
          ? '0' + novaData.getMinutes().toString()
          : novaData.getMinutes().toString();

      return horas + ':' + minutos;
    } else {
      return n;
    }
  } catch (erro) {
    return n;
  }
};

export const slugify = (value: string): string => {
  return value
    ?.toString()
    ?.toLowerCase()
    .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a') // Special Characters #1
    .replace(/[èÈéÉêÊëË]+/g, 'e') // Special Characters #2
    .replace(/[ìÌíÍîÎïÏ]+/g, 'i') // Special Characters #3
    .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o') // Special Characters #4
    .replace(/[ùÙúÚûÛüÜ]+/g, 'u') // Special Characters #5
    .replace(/[ýÝÿŸ]+/g, 'y') // Special Characters #6
    .replace(/[ñÑ]+/g, 'n') // Special Characters #7
    .replace(/[çÇ]+/g, 'c') // Special Characters #8
    .replace(/[ß]+/g, 'ss') // Special Characters #9
    .replace(/[Ææ]+/g, 'ae') // Special Characters #10
    .replace(/[Øøœ]+/g, 'oe') // Special Characters #11
    .replace(/[%]+/g, 'pct') // Special Characters #12
    .replace(/\-\-+/g, '') // Replace multiple - with single ""
    .replace(/\-/g, '') // Replace - with single ""
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/g, '') // Trim - from end of text
    .replace(/\./g, ''); // Trim - from end of text
};
export const urlfy = (value: string): string => {
  return value
    ?.toString()
    ?.toLowerCase()
    .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a') // Special Characters #1
    .replace(/[èÈéÉêÊëË]+/g, 'e') // Special Characters #2
    .replace(/[ìÌíÍîÎïÏ]+/g, 'i') // Special Characters #3
    .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o') // Special Characters #4
    .replace(/[ùÙúÚûÛüÜ]+/g, 'u') // Special Characters #5
    .replace(/[ýÝÿŸ]+/g, 'y') // Special Characters #6
    .replace(/[ñÑ]+/g, 'n') // Special Characters #7
    .replace(/[çÇ]+/g, 'c') // Special Characters #8
    .replace(/[ß]+/g, 'ss') // Special Characters #9
    .replace(/[Ææ]+/g, 'ae') // Special Characters #10
    .replace(/[Øøœ]+/g, 'oe') // Special Characters #11
    .replace(/[%]+/g, 'pct') // Special Characters #12
    .replace(/\s+/g, '-')
    .replace(/\-\-+/g, '-') // Replace multiple - with single ""
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/\./g, '') // Trim - from end of text
    .replace(/[^\w\-]+/g, '') // Trim - from end of text
    .replace(/-+$/g, ''); // Trim - from end of text
};

export const converteData = (DataDDMMYYHRMM): Date => {
  return new Date(
    parseInt(DataDDMMYYHRMM.substring(6, 10), 10),
    parseInt(DataDDMMYYHRMM.substring(3, 5), 10) - 1,
    parseInt(DataDDMMYYHRMM.substring(0, 2), 10),
    parseInt(DataDDMMYYHRMM.substring(14, 16), 10),
    parseInt(DataDDMMYYHRMM.substring(17, 19), 10)
  );
};

export const retornaHoraAtual = (): string => {
  function pad(s: any): any {
    return s < 10 ? '0' + s : s;
  }
  const date = new Date();
  return [date.getHours(), date.getMinutes()].map(pad).join(':');
};

export const retornaDataAtual = (): string => {
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
};

export const retornaDataOntem = (): string => {
  const hoje = new Date();
  const ontem = new Date(hoje.getTime());
  ontem.setDate(hoje.getDate() - 1);
  const dd = String(ontem.getDate()).padStart(2, '0');
  const mm = String(ontem.getMonth() + 1).padStart(2, '0');
  const yyyy = ontem.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
};

export const retornaDataAtualIngles = (): string => {
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
};

export const dataParaAnomesdia = (dmY: string): string => {
  if (dmY.indexOf('/') > -1) {
    const data = dmY.split('/');
    return data.length > 0 ? data[2] + data[1] + data[0] : dmY;
  } else {
    return dmY;
  }
};

export const anoMesDiaParaDataBR = (dmY: string): string => {
  if (dmY.indexOf('-') > -1) {
    const data = dmY.split('-');
    return data.length > 0 ? data[2] + '/' + data[1] + '/' + data[0] : dmY;
  } else {
    return dmY;
  }
};

export const paraDataIngles = (dmY: string): string => {
  if (dmY.indexOf('/') > -1) {
    const data = dmY.split('/');
    return data.length > 0 ? data[2] + '-' + data[1] + '-' + data[0] : dmY;
  } else {
    return dmY;
  }
};

export const anoMesDiaParaDiaAnoMes = (dmY: string): string => {
  try {
    return (
      dmY.substring(6, 8) +
      '/' +
      dmY.substring(4, 6) +
      '/' +
      dmY.substring(0, 4)
    );
  } catch {
    return dmY;
  }
};

export const validarData = (dat: any): boolean => {
  // Padrão data: YYYY/MM/DD
  if(isNaN(Date.parse(dat)))
    return false;

  return true;
}


export function formatarTamanho(tamanho: any): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;

  if (typeof tamanho === "number") {
    while (tamanho >= 1024) {
      tamanho /= 1024;
      ++i;
    }

    tamanho = `${tamanho.toFixed(2)} ${units[i]}`;
  } else {
    tamanho = "--";
  }

  return tamanho;
}

export function parseDecimal(value: string | number): number {
  return parseFloat(value.toString());
}

export function parseMoney(value: string | number): string {
  return value !== null ? toLocaleFixed(parseDecimal(value), 2) : '0,00';
}

export class MascaraUtil {
  public static mascaraCpf = [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];
  public static mascaraRg = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
  ];
  public static mascaraCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];
  public static mascaraTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public static mascaraTelefoneFixo = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public static mascaraCep = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
  ];
  public static mascaraData = [
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public static mascaraHoras = [/\d/, /\d/, ':', /\d/, /\d/];
  public static mascaraNit = [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    '-',
    /\d/,
  ];
  public static mascaraCorreio = [
    /[a-zA-Z]/,
    /[a-zA-Z]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    'BR',
  ];
  public static mascaraNumber(rawValue: string): RegExp[] {
    const mask = /[0-9]/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];

    for (let i = 0; i <= strLength; i++) {
      nameMask.push(mask);
    }

    return nameMask;
  }
  public static mascaraTudo(rawValue: string): RegExp[] {
    const mask = /[\s\S]/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];

    for (let i = 0; i <= strLength; i++) {
      nameMask.push(mask);
    }

    return nameMask;
  }
  public static mascaraUrl(rawValue: string): RegExp[] {
    const mask = /[-a-zA-Z0-9@_\+#=]/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];

    for (let i = 0; i <= strLength; i++) {
      nameMask.push(mask);
    }

    return nameMask;
  }
}

export function moveItemInFormArray(
  formArray: UntypedFormArray,
  fromIndex: number,
  toIndex: number
): void {
  const dir = toIndex > fromIndex ? 1 : -1;

  const from = fromIndex;
  const to = toIndex;

  const temp = formArray.at(from);
  for (let i = from; i * dir < to * dir; i = i + dir) {
    const current = formArray.at(i + dir);
    formArray.setControl(i, current);
  }
  formArray.setControl(to, temp);
}

export const dataParaAnomesdiaSeparadoPorBarras = (dmY: string): string => {
  if (dmY.indexOf('/') > -1) {
    const data = dmY.split('/');
    return data.length > 0 ? data[2] + '/' + data[1] + '/' + data[0] : dmY;
  }
  else {
    return dmY;
  }
}


export function toNumber(valor?: string): number {
  let vl;
  try {
    if (valor.indexOf(',') > -1)
      vl = parseFloat(valor.replace(/\./g, '').replace(/,/g, '.').trim());
    else vl = parseFloat(valor);
  } catch {
    vl = valor;
  }
  return vl;
}

export function converterValores(
  valor?: number | string,
  tipo?: string
): string {
  if (!valor) {
    return '';
  }

  if (typeof valor === 'string') {
    return valor;
  }

  tipo = tipo?.toLowerCase();

  switch (tipo) {
    case 'real':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    case 'r$':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    case 'moeda':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    case 'real_inteiro':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
    case 'usd':
      return valor.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    case 'percentual':
      return `${valor.toString().replace('.', ',')}%`;
    case 'porcentagem':
      return `${valor.toString().replace('.', ',')}%`;
    case 'decimal':
      return valor.toString();
    case 'inteiro':
      return valor.toLocaleString('pt-BR');
    case 'dias':
      return valor + ' dias';
    default:
      return valor.toString();
  }
}

export function zeroEsquerda(value, totalWidth, quantidadeZeros): string {
  const length = totalWidth - value.toString().length + 1;
  return Array(length).join(quantidadeZeros || '0') + value;
}

export function iniciaisNome(nm_completo: any): any{
  if(nm_completo){
    let nome = nm_completo
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let iniciais = [...nome?.matchAll(rgx)] || [];
    iniciais = (
      (iniciais?.shift()?.[1] || '') + (iniciais?.pop()?.[1] || '')
    )?.toUpperCase();
    return iniciais;
  } else {
    return nm_completo
  }
}

export class GenericValidator {
  constructor() {}
  /**
   * Valida se o CPF é valido. Deve-se ser informado o cpf sem máscara.
   */
  public static isValidCpf() {
    return (control: AbstractControl): Validators => {
      const cpf = control.value;
      if (cpf) {
        let numbers, digits, sum, i, result, equalDigits;
        equalDigits = 1;
        if (cpf.length < 11) {
          return null;
        }

        for (i = 0; i < cpf.length - 1; i++) {
          if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
            equalDigits = 0;
            break;
          }
        }

        if (!equalDigits) {
          numbers = cpf.substring(0, 9);
          digits = cpf.substring(9);
          sum = 0;
          for (i = 10; i > 1; i--) {
            sum += numbers.charAt(10 - i) * i;
          }

          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(0))) {
            return true;
          }
          numbers = cpf.substring(0, 10);
          sum = 0;

          for (i = 11; i > 1; i--) {
            sum += numbers.charAt(11 - i) * i;
          }
          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(1))) {
            return true;
          }

          return null;
        } else {
          return true;
        }
      }
      return null;
    };
  }
}

export const validarCPF = (cpf: string): boolean => {
  if(!cpf)
    return false;
	cpf = cpf.replace(/[^\d]+/g,'');
	if(cpf == '') return false;
	// Elimina CPFs invalidos conhecidos
	if (cpf.length != 11 ||
		cpf == "00000000000" ||
		cpf == "11111111111" ||
		cpf == "22222222222" ||
		cpf == "33333333333" ||
		cpf == "44444444444" ||
		cpf == "55555555555" ||
		cpf == "66666666666" ||
		cpf == "77777777777" ||
		cpf == "88888888888" ||
		cpf == "99999999999")
			return false;
	// Valida 1o digito
	let add = 0;
	for (let i=0; i < 9; i ++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
		let rev = 11 - (add % 11);
		if (rev == 10 || rev == 11)
			rev = 0;
		if (rev != parseInt(cpf.charAt(9)))
			return false;
	// Valida 2o digito
	add = 0;
	for (let  i = 0; i < 10; i ++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(10)))
		return false;
	return true;
}

export const validarCnpj = (cnpj): boolean => {

  cnpj = cnpj.replace(/[^\d]+/g,'');

  if(cnpj == '') return false;

  if (cnpj.length != 14)
      return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0,tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  let i = tamanho;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
      return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
        return false;

  return true;
}


export const validarPermissao = (permissao) => {
  let permissaoUsuario = JSON.parse(localStorage.getItem('permissaoUsuario'));
  if (permissao && permissaoUsuario) {
    if (permissaoUsuario.includes(permissao)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export const validarParametros = (parametros) => {
  let data = {}
  for (const key in parametros) {
    let valor = parametros[key]
    if (valor && parametros.hasOwnProperty(key))   {
      data[key] = valor
    }
  }
  return data
}


export const getFormAdminInfos = (campos, form: FormGroup) => {
  let formValue = form.value
  let camposEnviados = []
  let camposInvalidos = [];

  campos.forEach(campo => {
    let control = form.get(campo.hash)
    let valor = formValue[campo.hash]
    camposEnviados.push({
      hash: campo.hash,
      nome: campo.nome,
      valor: valor,
      campo: control
    })
    if (control?.invalid) {
      camposInvalidos.push({
        hash: campo.hash,
        nome: campo.nome,
        campo: control
      })
    }
  });

  return {
    enviados: camposEnviados,
    invalidos: camposInvalidos
  }

}


export const criarCamposCadastroArvore = (valores, campos, formBuilder) => {
  let jsonCampos = {}
  campos.forEach(campo => {
    if (!campo.hash_pai) return
    let validators: ValidatorFn[] = []
    if(campo?.configuracao_geral?.is_obrigatorio){
      if (campo.tipo == 'checkbox') {
        validators.push(Validators.requiredTrue)
      }else {
        validators.push(Validators.required)
      }
    }
    jsonCampos[campo.hash] = [valores[campo.hash] || '', validators];
  });
  jsonCampos['filhos'] = formBuilder.array([]);
  return formBuilder.group(jsonCampos) as FormGroup;
}

export const normalizarString = (str: string): string =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

export const deParaDadosPlanilha = (dados, modelo) => {
  dados = dados.map(dado => {
    for (const key in dado) {
      let coluna = modelo.find(m => normalizarString(m.header) == key)
      if (coluna) {
        dado[coluna.key] = dado[key]
        delete dado[key]
      }
    }
    return dado
  })
  return dados
}

export const viewInicial = (): string => {
  const token = localStorage.getItem('token')
  let tokenDecoded: any = token ? jwtDecode(JSON.parse(token)?.token_aplicativo) : null
  let view = '404';
  if (token) {
    // if (tokenDecoded?.view_inicial?.vendamais) {
    //   view = tokenDecoded?.view_inicial?.vendamais;
    // }
    if (tokenDecoded?.view_inicial) {
      view = tokenDecoded?.view_inicial;
    }
  }

  return view
}

export const validaCor = (valor: number): string => {
  const cores = [
    { min: -1, max: 20, cor: '#D9342B' },
    { min: 20, max: 40, cor: '#FF8201' },
    { min: 40, max: 60, cor: '#FFC100' },
    { min: 60, max: 80, cor: '#22C55E' },
    { min: 80, max: 1000, cor: '#006EFF' }
  ];

  const cor = cores.find(c => valor > c.min && valor <= c.max);
  return cor ? cor.cor : 'var(--surface-d)';
}

export const numberToColor = (valor: number): string => {
  const cores = [
    { number: 1, cor: '#D9342B' },
    { number: 2, cor: '#FF8201' },
    { number: 3, cor: '#FFC100' },
    { number: 4, cor: '#22C55E' },
    { number: 5, cor: '#006EFF' }
  ];

  const cor = cores.find(c => valor == c.number);
  return cor ? cor.cor : 'var(--surface-d)';
}

export const numberToColorRange10 = (valor: number): string => {
  const cores = [
    { number: 0, cor: '#D9342B' },
    { number: 1, cor: '#D9342B' },
    { number: 2, cor: '#D9342B' },
    { number: 3, cor: '#FF8201' },
    { number: 4, cor: '#FF8201' },
    { number: 5, cor: '#FFC100' },
    { number: 6, cor: '#FFC100' },
    { number: 7, cor: '#22C55E' },
    { number: 8, cor: '#22C55E' },
    { number: 9, cor: '#006EFF' },
    { number: 10, cor: '#006EFF' }
  ];

  const cor = cores.find(c => valor == c.number);
  return cor ? cor.cor : 'var(--surface-d)';
}

export const validarFlechaCrescimento = (valor: number): number => {
  const flechas = [
    { min: 0, max: 20, flecha: 1 },
    { min: 20, max: 40, flecha: 2 },
    { min: 40, max: 60, flecha: 3 },
    { min: 60, max: 80, flecha: 4 },
    { min: 80, max: 1000, flecha: 5 }
  ];

  const flecha = flechas.find(c => valor > c.min && valor <= c.max);
  return flecha ? flecha.flecha : 0;
}

export const getIniciais = (s: string): string => {
	if (s && s.length > 0) {
	  	const palavrasSplitadas = s.split(' ');
	  	const primeiraInicial = palavrasSplitadas[0].charAt(0);
	  	const ultimaInicial = palavrasSplitadas[palavrasSplitadas.length - 1].charAt(0);
	  	return `${primeiraInicial}${ultimaInicial}`;
	} else {
	  	return '';
	}
}

export const converterParaInt = (valor: any): number => {
  const valorInt = parseInt(valor);
  return isNaN(valorInt) ? 0 : valorInt;
}

export const converterIntParaCorTextoCardsTabelas = (valor: number): string => {
  if (valor > 0 && valor <= 5) {
    return '#ffffff';
  } else {
    return 'var(--text-color);';
  }
}

export const converterIntParaCorBackgroundCardsTabelas = (valor: number): string => {
  const colorMap = {
    1: '#D9342B',
    2: '#FFC100',
    3: '#FF8201',
    4: '#22C55E',
    5: '#006EFF'
  };

  return colorMap[valor] || null;
}

export const defaultAnomes = () => {
  const data = new Date();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  return `${ano}${mes < 10 ? '0' + mes : mes}`;
}

export const defaultAnomesDia = () => {
  const data = new Date();
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  return `${ano}${mes < 10 ? '0' + mes : mes}${dia < 10 ? '0' + dia : dia}`;
}

export const defaultCdFilial = () => {
  const cd_filial = 'f_0';
  return cd_filial;
}

export const converterPadraoTipo = (tipo:any) => {
  const mapTipo = {
    cd_filial: 'f',
    cdcr: 'cdcr',
    cidade: 'c',
  }

  return mapTipo[tipo] || 'f';
}

export const convertePrecoParaPadraoBR = (preco: string | number = 0) => {
	return preco !== null ? toLocaleFixed(parseDecimal(preco), 2) : '0,00';
}

export interface Mail {
  id?: any;
  from?: string;
  to?: string;
  email?:string;
  image?: string;
  date?: string;
  message?: string;
  title?: string;
  important?: boolean;
  starred?: boolean;
  trash?: boolean;
  archived?: boolean;
  spam?: boolean;
  sent?: boolean;
}

export const construirTreeListAreas = (lista_areas: any) => {
  // Primeiro, crie um objeto para mapear os itens por 'cd_pai'
  const map = {};
  lista_areas.forEach(item => {
      map[item.id] = map[item.id] || { children: [] };
      map[item.id].key = item.cd_tipo;
      map[item.id].label = `${item.nm_descritivo}`;
      map[item.id].data = `${item.nm_descritivo}`;
  });

  // Em seguida, adicione os filhos aos seus pais
  lista_areas.forEach(item => {
      if (item.area_pai_id !== null) {
          const parent = map[item.area_pai_id];
          parent.children.push({
              key: item.cd_tipo,
              label: `${item.nm_descritivo}`,
              data: `${item.nm_descritivo}`
          });
      }
  });

  // Finalmente, retorne a lista de pais que não têm área_pai_id
  return lista_areas
      .filter(item => item.area_pai_id === null)
      .map(item => map[item.id]);
}

export const construirTreeListCidadesEstados = (lista_cidades_estados: any) => {
  // Primeiro, crie um objeto para mapear os itens por 'codigo'
  const map = {};
  lista_cidades_estados?.forEach(item => {
      map[item.codigo] = map[item.codigo] || { children: [] };
      map[item.codigo].key = item.cd_tipo;
      map[item.codigo].label = `${item.nm_descritivo}`;
      map[item.codigo].data = `${item.nm_descritivo}`;
  });

  // Em seguida, adicione as cidades aos seus estados
  lista_cidades_estados?.forEach(item => {
      if (item.estado_id !== undefined && item.estado_id !== null) {
          const parent = map[item.estado_id];
          parent.children.push({
              key: item.cd_tipo,
              label: `${item.nm_descritivo}`,
              data: `${item.nm_descritivo}`
          });
      }
  });

  // Finalmente, retorne a lista de estados que não têm 'estado_id'
  return lista_cidades_estados?.filter(item => item.estado_id === undefined || item.estado_id === null)
      .map(item => map[item.codigo]);
}


export const construirTreeListAreas2 = (lista_areas: any) => {
  // Primeiro, crie um objeto para mapear os itens por 'id'
  const map = {};
  lista_areas.forEach(item => {
    map[item.id] = map[item.id] || { children: [] };
    map[item.id].key = item.cd_tipo;
    map[item.id].label = `${item.nm_descritivo}`;
    map[item.id].data = item.cd_tipo;
  });

  // Em seguida, adicione os filhos aos seus pais
  lista_areas.forEach(item => {
    if (item.area_pai_id !== null) {
      const parent = map[item.area_pai_id];
      if (parent) { // Verifique se o pai existe
        parent.children.push(map[item.id]); // Adicione a referência do objeto filho ao pai
      }
    }
  });

  // Finalmente, retorne a lista de pais que não têm área_pai_id
  return lista_areas
    .filter(item => item.area_pai_id === null)
    .map(item => map[item.id]);
}

export const montarArvore = (menu : any) => {
  const menus = [];
  menu.forEach(menu => {
    menus.push({
      icone: `${menu.icone}`,
      icon_material: true,
      nome: menu.nome,
      filhos: menu.lista_filhos && Array.isArray(menu.lista_filhos) && menu.lista_filhos.length > 0 ? montarArvore(menu.lista_filhos) : [],
      url: menu.url,
    })
  })

  return menus
}

export const pad = (num: number|string, tam: number) => {
  num = num.toString();
  while (num.length < tam) num = "0" + num;
  return num;
}

export const formatCpf = (cpf: string) => {
  if (cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return '';
}

export const formatCelular = (celular: string) => {
  if (celular) {
    return celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return '';
}

export const validaPontoFuncao = (valor: string) => {
  const list_ponto_funcao = localStorage.getItem('ponto_funcao');
  return list_ponto_funcao?.includes(valor);
}

export const validarUrlApp = (fullUrl: string) => {
  const isApp = fullUrl.includes('app');
  return isApp;
}

export const capitalizeFirstLetter = (str: string) => {
  if(!str)
    return str
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) {
      return false;
  }

  if (/^(\d)\1+$/.test(cpf)) {
      return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
      remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
      remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(10))) {
      return false;
  }

  return true;
}

export const getLastPart = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

export const simplificacaoNumerica = (num: number): string => {
  if(!num)
    return num.toString()
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
}

export const formatarBytes = (bytes: number): string => {
  if (!bytes)
    return '0B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const returnDnsSplitted = (): string => {
  let url = window.location.hostname.split('.')[0];
  if (url.endsWith('app')) {
    url = url.slice(0, -3);
  }
  url = `${url}api`;
  return url;
}

export const parseDuration = (duration: string): string => {
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d+))?S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return "Invalid duration format";
  }

  const days = matches[1] ? parseInt(matches[1], 10) : 0;
  const hours = matches[2] ? parseInt(matches[2], 10) : 0;
  const minutes = matches[3] ? parseInt(matches[3], 10) : 0;
  const seconds = matches[4] ? parseInt(matches[4], 10) : 0;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export const buscarVersaoTela = (url: string): string => {
  const versoesTelas = JSON.parse(localStorage.getItem('versoes-telas'))
  if(versoesTelas){
    const versaoTela = versoesTelas[url]
    if(versaoTela?.versao){
      return versaoTela?.versao
    }
  }
  return null
}

export const versaoTelaAtual = (url: string): string => {
  const versoesTelas = JSON.parse(localStorage.getItem('versoes-telas'))
  if(versoesTelas){
    return versoesTelas[url]
  }

  return null
}

export const urlAtual = (urls: Array<any>): string => {
  let urlString = ''
  if(urls?.length){
    urls?.map(url => {
      urlString += `${url?.path}/`
    })
  }
  return urlString;
}

export const formatarData = (dataISO: string): string => {
  const data = new Date(dataISO);

  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
  const ano = data.getFullYear();

  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
}

export const converterStatusPedido = (status: string): string =>{
  switch(status){
    case 'separacao':
      return 'Separação';
    case 'embalado':
      return 'Embalado';
    case 'saiu_estoque':
      return 'Saiu Estoque';
    default:
      return 'Desconhecido';
  }
}