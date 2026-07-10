import { useAnuncios } from './useAnuncios.js';
import styles from './BannerAnuncio.module.css';

/** Espaço de anúncios reutilizável — plug-and-play entre apps (ver §8 da especificação). */
export default function BannerAnuncio() {
  const anuncio = useAnuncios();
  if (!anuncio) return null;

  return (
    <a
      href={anuncio.link || undefined}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={styles.banner}
    >
      <div className={styles.wrap}>
        <span className={styles.rotulo}>Publicidade</span>
        {anuncio.tipo === 'imagem' && anuncio.imagemUrl && (
          <img src={anuncio.imagemUrl} alt={anuncio.titulo || ''} className={styles.imagem} />
        )}
      </div>
      <div>
        {anuncio.titulo && <p className={styles.titulo}>{anuncio.titulo}</p>}
        {anuncio.tipo === 'texto' && anuncio.texto && <p className={styles.texto}>{anuncio.texto}</p>}
      </div>
    </a>
  );
}
