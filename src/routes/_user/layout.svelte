<script lang="ts">
    import { getPlatform } from '@/lib/shared/platform';
    import { authentication } from '@/lib/auth/store.svelte';
	import { type Snippet } from 'svelte';  
    import { Toaster } from 'svelte-sonner'
    import { routes } from '@/components/util/routes';
    import { ArrowRight, House, LoaderCircle } from '@lucide/svelte';

	let { children }: { children: Snippet } = $props();

    $inspect(authentication.status)
</script>

{#if authentication.status === "authenticated"}
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
{:else if authentication.status === "unauthenticated"}
    <main class="flex flex-col flex-1 items-center justify-center">
        <h1 class="font-title text-2xl font-bold text-content-900">            
            You are not logged in
        </h1>

        <p class="min-w-80 text-center"> Create a new account or sign into your account. </p>

        <a
            href={routes.get("Log In")?.link} 
            aria-label="This is a link to go to the home page"
            class="mt-4 flex justify-between items-center gap-x-4 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
        >
            Log In

            <ArrowRight class="size-4"/>
        </a>
    </main>
{:else if authentication.status === "loading"}
    <main class="flex flex-1 items-center justify-center">
        <LoaderCircle class="animate-spin"/>
    </main>
{:else if authentication.status === "error"}
    <main class="flex flex-col flex-1 items-center justify-center">
        <h1 class="font-title text-2xl font-bold text-content-900">            
            Error
        </h1>

        <p class="min-w-80 text-center"> You have faced an error: {authentication.error} </p>

        <a
            href={routes.get("Home")?.link} 
            aria-label="This is a link to go to the home page"
            class="mt-4 flex justify-between items-center gap-x-4 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
        >
            Go to the Home Page

            <House class="size-4"/>
        </a>
    </main>
{/if}
