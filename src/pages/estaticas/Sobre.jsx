import PaginaEstatica from './PaginaEstatica.jsx';

export default function Sobre() {
  return (
    <PaginaEstatica
      gradient="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      titulo="Sobre o LMania"
      seoTitulo="Sobre o LMania"
      seoDesc="Conheça o LMania: ferramenta matemática gratuita para apostadores de loterias brasileiras, criada por Rodrigo Faustino."
      secoes={[
        {
          title: 'O que é o LMania',
          content: '<p>O LMania é uma ferramenta matemática gratuita e 100% offline para apostadores das loterias da Caixa: Lotofácil, Lotomania, Mega-Sena e Quina. Permite cadastrar jogos, conferir resultados, gerar combinações e fechamentos matemáticos, e analisar a frequência histórica das dezenas.</p>',
        },
        {
          title: 'Tecnologia',
          content: '<p>Construído como Progressive Web App (PWA), funciona instalado no seu dispositivo e offline — seus jogos ficam salvos localmente, sem enviar dados para servidores externos.</p>',
        },
        {
          title: 'Criador',
          content: '<p>Desenvolvido por Rodrigo Faustino como um projeto independente, sem vínculo com a Caixa Econômica Federal.</p>',
        },
      ]}
    />
  );
}
