import Bola from '../../atoms/Bola/Bola.jsx';
import styles from './GradeDezenas.module.css';

/** Grade interativa 1..max — usada por Cadastrar, Combinar e Fechar. */
export default function GradeDezenas({ max, selecionadas, aoAlternar, cor }) {
  const numeros = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className={styles.grade}>
      {numeros.map((n) => (
        <Bola key={n} numero={n} selecionada={selecionadas.has(n)} aoClicar={() => aoAlternar(n)} cor={cor} />
      ))}
    </div>
  );
}
