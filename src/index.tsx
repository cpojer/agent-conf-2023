import App from './App';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const imagePaths = import.meta.glob('./photos/*.jpg', { as: 'url' });

Promise.all(Object.keys(imagePaths).map((path) => imagePaths[path]())).then(
  (photos) =>
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App photos={photos} />
      </StrictMode>,
    ),
);
