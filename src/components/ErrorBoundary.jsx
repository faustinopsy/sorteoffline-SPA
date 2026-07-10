import { Component } from 'react';

/** Único componente de classe do app (obrigatório para capturar erros de render). */
export default class ErrorBoundary extends Component {
  state = { erro: null };

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  render() {
    if (this.state.erro) {
      return (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h1>Algo deu errado</h1>
          <p>Tente recarregar a página.</p>
          <button type="button" onClick={() => window.location.assign('/')}>
            Voltar ao início
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
