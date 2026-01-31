<script lang="ts">
    // import { authController } from '@/lib/auth/controller';
    import { appController } from '@/lib/app/controller';
    import { authStore } from '@/lib/auth/store.svelte';
    import { plannerRepo } from '@/lib/planner/repository';
	import { onDestroy, onMount, type Snippet } from 'svelte';  
    
	let { children }: { children: Snippet } = $props();

    // On the page being mounted to the DOM, the authentication controller starts.
    onMount(() => {
        appController.start()
    })

    // On the page being unmounted from the DOM, the authentication controller stops.
    onDestroy(() => {
        appController.stop()
    })
</script>

<main>
    {@render children()}
</main>