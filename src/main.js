import { createApp } from 'vue';
import component from '@/components/UI';
import App from './App.vue';

const app = createApp(App);

component.forEach((c) => {
  app.component(c.name, c);
});

app.mount('#app');
