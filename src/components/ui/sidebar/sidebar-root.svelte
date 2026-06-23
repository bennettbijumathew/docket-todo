<script lang="ts">
    import { routes } from '@/components/util/routes';
    import { getPlatform } from '@/lib/shared/platform';
    import { searchParams } from 'sv-router';
    import { type Snippet } from 'svelte';
    import { fade, fly } from 'svelte/transition';

    type RootProps = { 
        children?: Snippet 
    }

    let { children }: RootProps = $props()

    // The sidebar is opened based on if the search params include the sidebar keyword. 
    const key: string = "sidebar"
    let sidebarOpen: boolean = $derived(searchParams.has(key))

    // On creating a reference to the sidebar, these function can be called. 
    export function toggle() {
        if (sidebarOpen == false) {
            searchParams.append(key, true);
        }
        else {
            searchParams.delete(key);
        }
    }
</script>

<section 
    transition:fly={{ duration: 300 }}
    class="
        {sidebarOpen ? 'w-75 sm:w-94' : 'w-0'} {getPlatform() == "windows" ? "pt-titlebar" : "pt-4"}
        box-border bg-background flex flex-col justify-between h-full overflow-hidden transition-[width] duration-200
        absolute left-0 z-10
        lg:relative lg:flex-none
    "
>
    <!-- Application title -->
    <div class="flex justify-between px-4"> 
        <a
            aria-label="Link to Docket's Homepage"
            href={routes.get("Home")?.link}
            class="font-title text-2xl font-bold text-content-900 hover:text-content-800"
        >
            Docket
        </a>
    </div>

    {@render children?.()}
</section>

<!-- This is a dark overlay over the app that on clicking it removes the sidebar. -->
{#if sidebarOpen == true}
    <button 
        transition:fade={{duration: 200}} 
        onclick={toggle} 
        class="
            bg-black/20 absolute h-full w-full z-9
            lg:hidden
        " 
        aria-label="Button that closes the task editor"
    >
    </button>
{/if}