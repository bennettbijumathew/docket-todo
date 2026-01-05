import { mount } from 'svelte'
import svelteApp from './app.svelte'

const app = mount(svelteApp, {
  target: document.getElementById('app')!,
})

export default app