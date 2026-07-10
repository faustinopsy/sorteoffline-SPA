import { ICONES } from './icones.js';

/** Ícone SVG inline pelo nome (ver icones.js). */
export default function Icone({ nome, tamanho = 22, className = '' }) {
  const svg = ICONES[nome];
  if (!svg) return null;
  return (
    <span
      className={`icone ${className}`}
      style={{ width: tamanho, height: tamanho, display: 'inline-flex' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
