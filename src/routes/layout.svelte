<script lang="ts">
    import { appController } from '@/lib/app/service';
    import { check } from '@tauri-apps/plugin-updater';
    import { onDestroy, onMount, type Snippet } from 'svelte';  

	let { children }: { children: Snippet } = $props();

    let isUpdateAvailable: boolean = $state(false);

    // On the page being mounted to the DOM, the authentication controller starts.
    onMount(async () => {
        appController.start();
        isUpdateAvailable = await check() !== null ? true : false ;
    })

    // On the page being unmounted from the DOM, the authentication controller stops.
    onDestroy(() => {
        appController.stop();
    })
</script>

<!-- VIEW -->
{@render children()}

{#if isUpdateAvailable}
    <section class="flex justify-between items-center px-3 py-1.5 bg-red-200">
        <div>
            <h1 class="font-title font-bold"> A new update is Available. </h1>
            <p class="text-sm"> To update your application, head into the settings page. </p>
        </div>

        <a
            href="/settings"
            class="bg-background hover:bg-background-50 px-2 py-1 rounded-lg shadow-lg"
        >
            Update
        </a>
    </section>
{/if}