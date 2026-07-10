import Spinner from '../../atoms/Spinner/Spinner.jsx';

/** Estado reutilizável de listas: carregando / erro / vazio. */
export default function EstadoLista({ carregando, erro, vazio, mensagemVazio = 'Nada por aqui ainda.' }) {
  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-6)' }}>
        <Spinner />
      </div>
    );
  }
  if (erro) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--danger)', padding: 'var(--sp-5)' }}>
        {erro.message || 'Ocorreu um erro.'}
      </p>
    );
  }
  if (vazio) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--sp-5)' }}>
        {mensagemVazio}
      </p>
    );
  }
  return null;
}
