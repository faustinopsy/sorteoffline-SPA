import { useState, useCallback, useRef } from 'react';
import Modal from './Modal.jsx';

/** Hook imperativo: `await confirmar('Título', 'Texto')` → boolean. Renderiza `<elemento/>` no JSX. */
export function useConfirmacao() {
  const [pedido, setPedido] = useState(null);
  const resolveRef = useRef(null);

  const confirmar = useCallback((titulo, texto) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setPedido({ titulo, texto });
    });
  }, []);

  const responder = (valor) => {
    setPedido(null);
    resolveRef.current?.(valor);
  };

  const elemento = pedido ? (
    <Modal
      titulo={pedido.titulo}
      texto={pedido.texto}
      onConfirmar={() => responder(true)}
      onCancelar={() => responder(false)}
    />
  ) : null;

  return { confirmar, elemento };
}
