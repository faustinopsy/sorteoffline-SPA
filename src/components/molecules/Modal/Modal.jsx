import Botao from '../../atoms/Botao/Botao.jsx';
import styles from './Modal.module.css';

/** Diálogo de confirmação (substitui SweetAlert2). Renderizado via useConfirmacao(). */
export default function Modal({ titulo, texto, textoConfirmar = 'Sim', textoCancelar = 'Cancelar', onConfirmar, onCancelar }) {
  return (
    <div className={styles.fundo} role="dialog" aria-modal="true" onClick={onCancelar}>
      <div className={styles.caixa} onClick={(e) => e.stopPropagation()}>
        <p className={styles.titulo}>{titulo}</p>
        {texto && <p className={styles.texto}>{texto}</p>}
        <div className={styles.acoes}>
          <Botao variante="fantasma" onClick={onCancelar}>
            {textoCancelar}
          </Botao>
          <Botao variante="perigo" onClick={onConfirmar}>
            {textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
