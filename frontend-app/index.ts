import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App)
// asegura que el entorno esté listo para Expo Go o una compilación nativa
registerRootComponent(App);
