// Conteúdo educacional estático por loteria — indexável pelo Google (preservado do app original).
export const LOTTERY_INFO = {
  'Mega-Sena': {
    intro:
      'A <strong>Mega-Sena</strong> é a maior loteria do Brasil, criada em 1996 pela Caixa Econômica Federal. Para ganhar o prêmio máximo (sena), é necessário acertar os 6 números sorteados dentre 60 dezenas disponíveis.',
    stats: [
      { label: 'Dezenas no volante', value: '60' },
      { label: 'Números por jogo', value: '6 a 15' },
      { label: 'Sorteios por semana', value: '2 (Qua e Sáb)' },
      { label: 'Probabilidade (6 nº)', value: '1 em 50.063.860' },
    ],
    faq: [
      { q: 'Como funciona a Mega-Sena?', a: 'Você escolhe de 6 a 15 números de 1 a 60. Acertando 4, 5 ou 6 números você ganha nas faixas de quadra, quina ou sena.' },
      { q: 'O que é fechamento matemático?', a: 'É uma estrutura de múltiplos jogos que garante uma cobertura mínima: se N dezenas do seu grupo estiverem entre as sorteadas, ao menos um jogo terá a quantidade de acertos definida.' },
    ],
  },
  Lotofácil: {
    intro:
      'A <strong>Lotofácil</strong> é a loteria com melhores probabilidades de acerto do Brasil, criada em 2003. O apostador marca de 15 a 20 números de um total de 25 e concorre a prêmios acertando de 11 a 15 dezenas.',
    stats: [
      { label: 'Dezenas no volante', value: '25' },
      { label: 'Números por jogo', value: '15 a 20' },
      { label: 'Sorteios por semana', value: '5 (Seg a Sex)' },
      { label: 'Probabilidade (15 nº)', value: '1 em 3.268.760' },
    ],
    faq: [
      { q: 'Por que a Lotofácil é a mais fácil?', a: 'Você marca 15 de 25 números e precisa acertar apenas 11 para ganhar um prêmio. A probabilidade é muito maior do que em outras loterias.' },
      { q: 'Quantos jogos tem um fechamento?', a: 'Depende do fechamento. Jogar 16 números gera 16 jogos de 15 dezenas; jogar 20 números pode gerar centenas de jogos dependendo da estrutura utilizada.' },
    ],
  },
  Quina: {
    intro:
      'A <strong>Quina</strong> é uma das loterias mais tradicionais do Brasil, criada em 1994. O apostador escolhe de 5 a 15 números de um universo de 80 dezenas e concorre acertando 2, 3, 4 ou 5 números.',
    stats: [
      { label: 'Dezenas no volante', value: '80' },
      { label: 'Números por jogo', value: '5 a 15' },
      { label: 'Sorteios por semana', value: '5 (Seg a Sex)' },
      { label: 'Probabilidade (5 nº)', value: '1 em 24.040.016' },
    ],
    faq: [
      { q: 'Qual a diferença entre quina e quadra?', a: 'Na Quina, acertar 5 números é o prêmio máximo (quina). Acertar 4 é a quadra, 3 é o terno e 2 é a duquina — cada faixa tem seu prêmio.' },
      { q: 'Como o LMania ajuda na Quina?', a: 'O LMania permite cadastrar seus jogos, analisar a frequência histórica das dezenas e criar fechamentos matemáticos para maximizar a cobertura do seu grupo.' },
    ],
  },
  Lotomania: {
    intro:
      'A <strong>Lotomania</strong> é uma loteria única no Brasil: o apostador marca exatamente 50 números de um universo de 100 dezenas. Foram sorteados 20 números por concurso e você ganha acertando 15, 16, 17, 18, 19 ou 20 — ou até acertando zero!',
    stats: [
      { label: 'Dezenas no volante', value: '100' },
      { label: 'Números por jogo', value: 'Exatamente 50' },
      { label: 'Sorteios por semana', value: '2 (Ter e Sex)' },
      { label: 'Sorteados por concurso', value: '20 dezenas' },
    ],
    faq: [
      { q: 'O que significa acertar zero na Lotomania?', a: 'Se nenhuma das suas 50 dezenas estiver entre as 20 sorteadas, você também ganha um prêmio! Isso é exclusividade da Lotomania.' },
      { q: 'Como funciona o fechamento na Lotomania?', a: 'Você escolhe um grupo de 50 a 60 dezenas e o LMania gera múltiplos bilhetes de 50 números que garantem uma cobertura mínima definida matematicamente.' },
    ],
  },
};
