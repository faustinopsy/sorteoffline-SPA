import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/organisms/Layout/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import Loteria from './pages/Loteria/Loteria.jsx';
import Blog from './pages/Blog/Blog.jsx';
import BlogPost from './pages/BlogPost/BlogPost.jsx';
import Configuracoes from './pages/Configuracoes/Configuracoes.jsx';
import Sobre from './pages/estaticas/Sobre.jsx';
import Contato from './pages/estaticas/Contato.jsx';
import Politicas from './pages/estaticas/Politicas.jsx';
import Privacidade from './pages/estaticas/Privacidade.jsx';

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Blog />} />
          <Route path="/ferramentas" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/:loteria" element={<Loteria />} />
          <Route path="/:loteria/:aba" element={<Loteria />} />
        </Route>
      </Routes>
    </>
  );
}
