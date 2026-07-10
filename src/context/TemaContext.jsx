import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TEMA_PADRAO } from '../services/temas.js';

const TemaContext = createContext(null);

function aplicarTemaNoDocumento(tema) {
  const root = document.documentElement.style;
  root.setProperty('--bg', tema.bg);
  root.setProperty('--surface', tema.bg);
  root.setProperty('--card', tema.card);
  root.setProperty('--border', tema.border);
  root.setProperty('--text', tema.text);
  root.setProperty('--text-muted', tema.muted);
  root.setProperty('--accent', tema.accent);
  root.setProperty('--primary', tema.primary);
}

export function TemaProvider({ children }) {
  const [tema, setTemaState] = useState(() => {
    const salvo = localStorage.getItem('lmania_theme');
    return salvo ? JSON.parse(salvo) : TEMA_PADRAO;
  });
  const [fonte, setFonteState] = useState(() => parseInt(localStorage.getItem('lmania_font_size') || '100', 10));

  useEffect(() => aplicarTemaNoDocumento(tema), [tema]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${fonte}%`;
  }, [fonte]);

  const setTema = useCallback((novoTema) => {
    localStorage.setItem('lmania_theme', JSON.stringify(novoTema));
    setTemaState(novoTema);
  }, []);

  const setFonte = useCallback((percentual) => {
    localStorage.setItem('lmania_font_size', String(percentual));
    setFonteState(percentual);
  }, []);

  return <TemaContext.Provider value={{ tema, setTema, fonte, setFonte }}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}
