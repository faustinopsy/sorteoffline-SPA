import PaginaEstatica from './PaginaEstatica.jsx';

export default function Contato() {
  return (
    <PaginaEstatica
      gradient="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      titulo="Contato"
      seoTitulo="Contato | LMania"
      seoDesc="Entre em contato com o LMania. Dúvidas, sugestões e feedback sobre a ferramenta matemática de loterias."
      secoes={[
        {
          title: 'Fale conosco',
          content: '<p>Dúvidas, sugestões ou problemas com o app: <a href="mailto:rodrigohipnose@gmail.com">rodrigohipnose@gmail.com</a></p>',
        },
        {
          title: 'Jogo responsável',
          content:
            '<p>Se o jogo deixou de ser divertido e virou um problema, procure ajuda: CVV (Centro de Valorização da Vida) — 188, ou a Caixa Econômica Federal — 0800 726 0207.</p>',
        },
      ]}
    />
  );
}
