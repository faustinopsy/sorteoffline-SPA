import { useState, useCallback } from 'react';

/** {dados, carregando, erro, executar} — wrapper genérico para chamadas assíncronas. */
export function useRequisicao(fn) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const executar = useCallback(
    async (...args) => {
      setCarregando(true);
      setErro(null);
      try {
        const resultado = await fn(...args);
        setDados(resultado);
        return resultado;
      } catch (e) {
        setErro(e);
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [fn]
  );

  return { dados, carregando, erro, executar };
}
