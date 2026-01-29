<script lang="ts">
    import { authController } from '@/lib/controllers/auth.controller';
	import { onDestroy, onMount, type Snippet } from 'svelte';  
    
	let { children }: { children: Snippet } = $props();

    onMount(() => {
        authController.start()
    })

    onDestroy(() => {
        authController.stop()
    })
</script>

<main>
    {@render children()}
</main>