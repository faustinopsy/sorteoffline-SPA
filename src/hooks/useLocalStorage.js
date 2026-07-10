import { useState, useCallback } from 'react';

/** [valor, set] sincronizado com localStorage (JSON). */
export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const raw = localStorage.getItem(chave);
      return raw !== null ? JSON.parse(raw) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  const set = useCallback(
    (novo) => {
      setValor((atual) => {
        const resolvido = typeof novo === 'function' ? novo(atual) : novo;
        localStorage.setItem(chave, JSON.stringify(resolvido));
        return resolvido;
      });
    },
    [chave]
  );

  return [valor, set];
}
