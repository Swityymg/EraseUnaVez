import './styles.css';

function createApp() {
  const app = document.getElementById('app') as HTMLDivElement;
  if (!app) throw new Error('No #app element found');

  const container = document.createElement('main');
  container.className = 'container';

  const logo = document.createElement('img');
  // logo en /assets/logo.png
  logo.src = '/assets/logo.png';
  logo.alt = 'Logo Érase una Vez';
  logo.className = 'logo';

  const title = document.createElement('h1');
  title.textContent = 'Érase una Vez';
  title.className = 'title';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Biblioteca interactiva y generador de cuentos — frontend en TypeScript';
  subtitle.className = 'subtitle';

  container.appendChild(logo);
  container.appendChild(title);
  container.appendChild(subtitle);
  app.appendChild(container);
}

createApp();

// recarga en caliente (Vite)
if (import.meta.hot) {
  import.meta.hot.accept();
}
