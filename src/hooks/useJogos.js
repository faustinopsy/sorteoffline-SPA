import { useState, useCallback, useEffect } from 'react';
import * as storage from '../services/storage.js';

/** Jogos salvos de uma loteria + operações de adicionar/remover, sincronizados com storage. */
export function useJogos(loteria) {
  const [jogos, setJogos] = useState(() => storage.listar(loteria));

  useEffect(() => {
    setJogos(storage.listar(loteria));
  }, [loteria]);

  const adicionar = useCallback(
    (jogoCanonico) => {
      storage.salvar(loteria, jogoCanonico);
      setJogos(storage.listar(loteria));
    },
    [loteria]
  );

  const adicionarVarios = useCallback(
    (jogosCanonicos) => {
      storage.salvarMultiplos(loteria, jogosCanonicos);
      setJogos(storage.listar(loteria));
    },
    [loteria]
  );

  const remover = useCallback(
    (index) => {
      storage.remover(loteria, index);
      setJogos(storage.listar(loteria));
    },
    [loteria]
  );

  const excluirTodos = useCallback(() => {
    storage.excluirTodos(loteria);
    setJogos(storage.listar(loteria));
  }, [loteria]);

  return { jogos, adicionar, adicionarVarios, remover, excluirTodos };
}
