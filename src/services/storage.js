// Jogos por loteria — array JSON em `lmania_jogos_<url>`.
// Formato de cada item: string canônica "03,07,12,19,25" (zero-padded, ordenado).

const chaveNova = (url) => `lmania_jogos_${url}`;

function lerArray(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function gravarArray(chave, arr) {
  localStorage.setItem(chave, JSON.stringify(arr));
}

/** Migra o formato antigo (contador + itens numerados, sem prefixo) uma única vez. */
function migrarFormatoAntigo(loteria) {
  const { nome, simb, url } = loteria;
  const contador = parseInt(localStorage.getItem(simb) || '0', 10);
  if (!contador) return [];

  const migrados = [];
  for (let i = 1; i <= contador; i++) {
    const item = localStorage.getItem(`${nome}_${i}`);
    if (item) migrados.push(item);
  }
  gravarArray(chaveNova(url), migrados);
  return migrados;
}

export function listar(loteria) {
  const chave = chaveNova(loteria.url);
  const atual = lerArray(chave);
  if (atual !== null) return atual;
  return migrarFormatoAntigo(loteria);
}

export function salvar(loteria, jogoCanonico) {
  const chave = chaveNova(loteria.url);
  const jogos = listar(loteria);
  jogos.push(jogoCanonico);
  gravarArray(chave, jogos);
}

export function salvarMultiplos(loteria, jogosCanonicos) {
  const chave = chaveNova(loteria.url);
  const jogos = listar(loteria);
  gravarArray(chave, jogos.concat(jogosCanonicos));
}

export function remover(loteria, index) {
  const chave = chaveNova(loteria.url);
  const jogos = listar(loteria);
  jogos.splice(index, 1);
  gravarArray(chave, jogos);
}

export function excluirTodos(loteria) {
  gravarArray(chaveNova(loteria.url), []);
}
