import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { TemaProvider } from './context/TemaContext.jsx';
import { CabecalhoProvider } from './context/CabecalhoContext.jsx';
import './styles/tokens.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <TemaProvider>
        <CabecalhoProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CabecalhoProvider>
      </TemaProvider>
    </ErrorBoundary>
  </StrictMode>
);
