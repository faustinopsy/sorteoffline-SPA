import PaginaEstatica from './PaginaEstatica.jsx';

export default function Privacidade() {
  return (
    <PaginaEstatica
      gradient="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      titulo="Política de Privacidade"
      seoTitulo="Política de Privacidade | LMania"
      seoDesc="Política de Privacidade do LMania. Saiba como seus dados são tratados — 100% localmente no seu dispositivo."
      secoes={[
        {
          title: 'Armazenamento local',
          content:
            '<p>Seus jogos, tema e preferências ficam salvos exclusivamente no armazenamento local (localStorage) do seu navegador ou dispositivo. Nada é enviado para nossos servidores.</p>',
        },
        {
          title: 'Dados de terceiros',
          content:
            '<p>A busca de resultados é feita diretamente à API pública da Caixa Econômica Federal. O blog é servido por um backend próprio (api.lmania.com.br), sem coleta de dados pessoais.</p>',
        },
        {
          title: 'Última atualização',
          content: '<p>Julho de 2026.</p>',
        },
      ]}
    />
  );
}
