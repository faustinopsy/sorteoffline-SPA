import PaginaEstatica from './PaginaEstatica.jsx';

export default function Politicas() {
  return (
    <PaginaEstatica
      gradient="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      titulo="Políticas de Uso"
      seoTitulo="Políticas de Uso | LMania"
      seoDesc="Termos de uso, isenção de responsabilidade e jogo responsável do LMania."
      secoes={[
        {
          title: 'Isenção de responsabilidade',
          content:
            '<p>O LMania é uma ferramenta educacional e matemática. Não garantimos ganhos em nenhuma modalidade de loteria. Fechamentos e combinações aumentam a cobertura matemática do seu grupo de dezenas, mas não eliminam o acaso do sorteio.</p>',
        },
        {
          title: 'Jogo responsável',
          content:
            '<p>Jogue com responsabilidade. Não aposte valores que comprometam seu sustento ou de sua família. Se precisar de ajuda, procure o CVV (188).</p>',
        },
        {
          title: 'Uso dos dados',
          content: '<p>Todos os seus jogos e configurações são armazenados localmente no seu dispositivo — não coletamos nem enviamos essas informações a servidores externos.</p>',
        },
      ]}
    />
  );
}
