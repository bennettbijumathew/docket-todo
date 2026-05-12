<script lang="ts">
    import { app } from '@/lib/app/main';
    import { isAndroidPermissionsGranted } from '@/lib/notification/repository';
    import { getPlatform } from '@/lib/shared/platform';
    import { check } from '@tauri-apps/plugin-updater';
    import { onDestroy, onMount, type Snippet } from 'svelte';  

	let { children }: { children: Snippet } = $props();

    let isUpdateAvailable: boolean = $state(false);

    // On the page being mounted to the DOM, the application starts.
    onMount(async () => {
        app.start();

        // This checks if update is available for the windows application. 
        if (getPlatform() === "windows") {
            isUpdateAvailable = await check() !== null ? true : false;
        }

        if (getPlatform() === "android") {
            isAndroidPermissionsGranted()
        }
    })

    // On the page being unmounted from the DOM, the application stops.
    onDestroy(() => {
        app.stop();
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