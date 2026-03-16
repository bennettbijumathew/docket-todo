<script lang="ts">
    import { authStore } from '@/lib/auth/store.svelte';
    import { ArrowRight } from '@lucide/svelte';
    import { navigate } from 'sv-router/generated';
	import { type Snippet } from 'svelte';  
    
	let { children }: { children: Snippet } = $props();
</script>

<!-- This is the loading page -->
{#if authStore.getLoading() === true}
    <main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0 bg-background">
        <section class="flex-1 flex flex-col items-center justify-center border border-background-300 rounded-xl gap-y-2 p-4 animate-pulse">
            <h1 class="font-bold text-2xl font-title"> Loading.... </h1>
            <p> This process will be complete soon. </p>
        </section>
    </main>
<!-- This is the page for user's that don't have working account  -->
{:else if authStore.getReady() === false && authStore.getLoading() === false}
    <main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0 bg-background">
        <section class="flex-1 flex flex-col items-center justify-center border border-background-300 rounded-xl gap-y-2 p-4">
            <h1 class="font-bold text-2xl font-title"> Sorry :{"("} </h1>
            <p> There has been in error in the current session, try to log in again. </p>

            <button 
                onclick={() => navigate("/login")}
                class="flex gap-x-4 items-center mt-2 border-b-2 border-background-100 hover:border-background-300 transition-colors cursor-pointer"
            >
                Go to Login
                <ArrowRight class="size-4"/>
            </button>
        </section>
    </main>
<!-- This is the rendered page for if the user is authenticated -->
{:else if authStore.getReady() === true && authStore.getLoading() === false}
    <main class="
        flex flex-col flex-1 inset *:inset-shadow-b-md
        sm:min-h-0 sm:flex-row *:sm:inset-shadow-l-md
    ">
        {@render children()}
    </main>
{/if}