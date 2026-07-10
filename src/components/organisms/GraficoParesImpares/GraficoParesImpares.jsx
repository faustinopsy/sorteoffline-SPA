import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import Bola from '../../atoms/Bola/Bola.jsx';
import EstadoLista from '../../molecules/EstadoLista/EstadoLista.jsx';
import { buscarResultado } from '../../../services/resultados.js';
import { contarParesImpares } from '../../../services/loterias/estatisticas.js';
import { apiSlug } from '../../../services/loterias/config.js';
import styles from './GraficoParesImpares.module.css';

/** Pares/ímpares do último sorteio da loteria. */
export default function GraficoParesImpares({ loteria }) {
  const [concurso, setConcurso] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    buscarResultado(apiSlug(loteria))
      .then((lista) => ativo && setConcurso(lista))
      .catch((e) => ativo && setErro(e))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [loteria]);

  if (carregando || erro) return <EstadoLista carregando={carregando} erro={erro} />;
  if (!concurso) return null;

  const numeros = (concurso.dezenasSorteadasOrdemSorteio || concurso.listaDezenas || []).map(Number);
  const ordenados = [...numeros].sort((a, b) => a - b);
  const { pares, impares } = contarParesImpares(numeros);
  const dados = [
    { nome: 'Pares', valor: pares, cor: '#3b82f6' },
    { nome: 'Ímpares', valor: impares, cor: '#ef4444' },
  ];

  return (
    <div className={styles.wrap}>
      <p className={styles.info}>
        Concurso <strong>{concurso.numero}</strong> · {concurso.dataApuracao}
      </p>
      <div className={styles.numeros}>
        {ordenados.map((n) => (
          <Bola key={n} numero={n} cor={loteria.accent} />
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="nome" />
          <YAxis allowDecimals={false} />
          <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
            {dados.map((d) => (
              <Cell key={d.nome} fill={d.cor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
