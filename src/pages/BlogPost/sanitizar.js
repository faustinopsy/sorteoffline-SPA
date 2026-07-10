const TAGS_PERMITIDAS = new Set(['P', 'H2', 'H3', 'H4', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'A', 'BLOCKQUOTE', 'CODE', 'PRE', 'BR', 'HR', 'IMG']);

/** Sanitiza HTML de posts: remove tags/atributos não permitidos, força target=_blank em links externos. */
export function sanitizarHtml(html) {
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html
      .split(/\n{2,}/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join('');
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  const limpar = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!TAGS_PERMITIDAS.has(child.tagName)) {
          child.replaceWith(...child.childNodes);
          return;
        }
        [...child.attributes].forEach((attr) => {
          if (attr.name.startsWith('on') || (attr.name === 'href' && attr.value.startsWith('javascript:'))) {
            child.removeAttribute(attr.name);
          }
        });
        if (child.tagName === 'A' && child.getAttribute('href')?.startsWith('http')) {
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener noreferrer');
        }
        limpar(child);
      }
    });
  };

  limpar(doc.body);
  return doc.body.innerHTML;
}

export function tempoLeitura(texto) {
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}
