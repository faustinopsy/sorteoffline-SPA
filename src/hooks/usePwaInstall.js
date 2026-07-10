import { useEffect, useState, useCallback } from 'react';

const DISMISS_DIAS = 7;

/** Captura o evento beforeinstallprompt e expõe { podeInstalar, instalar, dispensar }. */
export function usePwaInstall() {
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault();
      if (localStorage.getItem('lmania_installed') === '1') return;

      const dispensadoEm = parseInt(localStorage.getItem('lmania_install_dismissed') || '0', 10);
      const diasDesde = (Date.now() - dispensadoEm) / (1000 * 60 * 60 * 24);
      if (dispensadoEm && diasDesde < DISMISS_DIAS) return;

      setEvento(e);
    }
    function onInstalled() {
      localStorage.setItem('lmania_installed', '1');
      setEvento(null);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const instalar = useCallback(async () => {
    if (!evento) return;
    await evento.prompt();
    setEvento(null);
  }, [evento]);

  const dispensar = useCallback(() => {
    localStorage.setItem('lmania_install_dismissed', String(Date.now()));
    setEvento(null);
  }, []);

  return { podeInstalar: !!evento, instalar, dispensar };
}
