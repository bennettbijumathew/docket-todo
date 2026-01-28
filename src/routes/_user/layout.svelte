<script lang="ts">
    import { AuthController } from '@/lib/controllers/auth.controller';
    import { AuthRepository } from '@/lib/repositories/auth.repository';
    import { AuthStore } from '@/lib/stores/auth.store.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';
    
	let { children }: { children: Snippet } = $props();

    const authStore = new AuthStore()
    const authRepository = new AuthRepository()
    const authController = new AuthController(authRepository, authStore)

    onMount(() => {
        authController.start()
    })

    onDestroy(() => {
        authController.stop()
    })
</script>

<main>
    {@render children()}

    <p class="text-red">
        {authStore.user?.email}
    </p>

    <button onclick={() => authController.stop()}> log out </button>  
</main>