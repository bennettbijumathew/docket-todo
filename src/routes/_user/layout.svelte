<script lang="ts">
    import { getPlatform } from '@/components/util/platform';
    import { authStore } from '@/lib/auth/store.svelte';
	import { type Snippet } from 'svelte';  
    import { Toaster } from 'svelte-sonner'

	let { children }: { children: Snippet } = $props();
</script>

{#if authStore.getReady() === true && authStore.getLoading() === false}
    <main class="
        flex flex-col flex-1 inset *:inset-shadow-b-md
        sm:min-h-0 sm:flex-row *:sm:inset-shadow-l-md
    ">
        {@render children()}

        <!-- Functions may send a toast to convey a message. A notification is shown within the page -->
        <Toaster 
            richColors={true}
            toastOptions={{
                unstyled: true,
                classes: {
                    toast: `border-0 flex justify-between items-center gap-x-4 px-3 py-2 rounded-lg shadow-md ${getPlatform() === "android" ? "mt-8" : ""}`,
                    title: 'font-default',
                }
            }}
            offset={getPlatform() === "android" ? "100px" : undefined}
            position={getPlatform() === "android" ? "top-center" : "bottom-right"}
        />
    </main>
{:else}
    <main class="
        flex flex-1 items-center justify-center
    ">
        <h1 class="font-title text-2xl font-bold text-content-900">            
            Loading
        </h1>
    </main>
{/if}
