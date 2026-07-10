import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CabecalhoContext = createContext(null);

export function CabecalhoProvider({ children }) {
  const [cabecalho, setCabecalho] = useState({ gradient: null, titulo: 'LMania' });
  const valor = useMemo(() => ({ cabecalho, setCabecalho }), [cabecalho]);
  return <CabecalhoContext.Provider value={valor}>{children}</CabecalhoContext.Provider>;
}

/** Define o gradiente/título do header para a página atual (equivalente ao antigo atualizaEstiloCabecalho). */
export function useCabecalho(gradient, titulo) {
  const ctx = useContext(CabecalhoContext);
  useEffect(() => {
    ctx.setCabecalho({ gradient, titulo });
  }, [gradient, titulo]);
}

export function useCabecalhoAtual() {
  return useContext(CabecalhoContext).cabecalho;
}
