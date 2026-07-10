<h1 class="cap"><span class="num">Capítulo 17</span> — Build, deploy e o próximo passo</h1>

## 17.1 O build de produção

Para publicar, gere a versão otimizada — minificada e empacotada:

```bash
npm run build      # cria a pasta dist/ com arquivos estáticos
npm run preview    # testa o build localmente, como seria em produção
```

Sempre teste com `preview` antes de subir: muitos bugs (caminhos de imagem, variáveis de ambiente faltando) só aparecem no build real, não no modo dev.

## 17.2 Onde hospedar

Como o resultado são arquivos estáticos, as opções são muitas e boa parte gratuita:

- **Vercel / Netlify / Cloudflare Pages** — conecte o repositório do GitHub; a cada `git push`, eles constroem e publicam sozinhos, com HTTPS automático. O caminho mais fácil.
- **Servidor próprio** (Apache/Nginx) — suba o conteúdo de `dist/` e configure o servidor.

## 17.3 A pegadinha da SPA: o 404 nas rotas

Suas rotas (`/mega-sena`, `/blog/meu-post`) só existem no JavaScript. Se o usuário abrir uma delas **a frio** (digitando ou por link), o servidor procura o arquivo, não acha, e devolve **404**. A cura: configurar o servidor para devolver sempre o `index.html` em qualquer rota, deixando o React Router resolver.

```apache
# .htaccess (Apache) — devolve index.html para qualquer rota
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Vercel e Netlify fazem isso automaticamente. Em servidor próprio, é você quem configura — e esquecer é o motivo nº 1 de "funciona no dev, links quebram em produção".

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — HTTPS é obrigatório para o PWA</span>
Publique sempre em **HTTPS**. Além de segurança, ele é *exigido* pelos recursos que o LMania usa: o service worker (o PWA offline/instalável) só funciona em HTTPS. Hoje o HTTPS é gratuito e automático nas plataformas modernas — não há desculpa. E aponte as variáveis de API (`VITE_...`) para os servidores reais em produção, não o `localhost` do desenvolvimento.
</div>

## 17.4 Mantendo o app vivo

Publicar é o começo da parte longa:

- **Dados envelhecem.** As tabelas de cobertura e os dados das loterias podem mudar; atualize e republique quando necessário. O service worker aplica a nova versão sozinho.
- **Monitore erros.** O `componentDidCatch` do Error Boundary (que você deve incluir, como no Provas) é o lugar de enviar erros para um serviço de monitoramento e descobrir bugs do mundo real antes dos usuários reclamarem.

## 17.5 Você chegou ao fim

<div class="callout pratica" markdown="1">
<span class="rot">Na prática — o que você construiu</span>
Você começou sem saber React e terminou com uma ferramenta real, publicada e instalável: grade interativa de dezenas, salvar/listar/conferir jogos, fechamentos matemáticos, estatísticas com gráficos, funcionamento offline, blog, temas e anúncios. Mais importante que o app: você aprendeu React de verdade — componentes e estado, arquitetura em camadas, persistência, PWA, algoritmos, gráficos e deploy — e tem o modelo mental para construir qualquer aplicação daqui em diante.
</div>

## 17.6 Para onde ir agora

- **TypeScript** — segurança de tipos; a migração num projeto Vite é gradual e indolor.
- **Testes** — seus services puros (combinações, fechamento, conferência) são perfeitos para testar com Vitest; comece por eles.
- **Web Workers** — se quiser calcular coberturas ao vivo, mova o trabalho pesado para uma thread paralela.
- **Um app seu, do zero** — é construindo que se aprende. Escolha uma ideia e aplique tudo isto.

A diferença entre copiar tutoriais e ser desenvolvedor está em entender *por que* cada peça existe. Ao longo deste livro, você construiu uma fundação, uma arquitetura, uma aplicação, uma inteligência (os algoritmos) e um produto — entendendo cada decisão. Agora o próximo app é seu. Construa. Entenda. E publique.
