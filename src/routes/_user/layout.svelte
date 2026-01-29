<script lang="ts">
    import { authController } from '@/lib/controllers/auth.controller';
	import { onDestroy, onMount, type Snippet } from 'svelte';  
    
	let { children }: { children: Snippet } = $props();

    // On the page being mounted to the DOM, the authentication controller starts.
    onMount(() => {
        authController.start()
    })

    // On the page being unmounted from the DOM, the authentication controller stops.
    onDestroy(() => {
        authController.stop()
    })
</script>

<main>
    {@render children()}
</main>