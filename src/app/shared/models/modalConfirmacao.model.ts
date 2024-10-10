export interface modalConfirmacaoOpcoes {
  icone?: string,
  iconeAceitar?: string,
  textoAceitar?: string,
  iconeRejeitar?: string,
  textoRejeitar?: string,
  callbackAceitar?: () => void,
  callbackRejeitar?: () => void
}

export interface modalConfirmacao {
  titulo: string,
  mensagem: string,
  config: modalConfirmacaoOpcoes
}
