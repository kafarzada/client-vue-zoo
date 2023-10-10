import { createApp } from 'vue'
import App from './App.vue'
import component from '@/components/UI'

const app = createApp(App)

component.forEach(c => {
    app.component(c.name, c)
})

app.mount('#app')


