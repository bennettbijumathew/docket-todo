import { mount } from 'svelte'
import svelteApp from './app.svelte'

const application = mount(svelteApp, {
  target: document.getElementById('app')!,
})

export default application