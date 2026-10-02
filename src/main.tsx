import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Kanit is bundled with the site, so no visitor data goes to a font CDN.
import '@fontsource/kanit/latin-300.css';
import '@fontsource/kanit/latin-400.css';
import '@fontsource/kanit/latin-500.css';
import '@fontsource/kanit/latin-600.css';
import '@fontsource/kanit/latin-900.css';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
