<script lang="ts">
    import { sidebar } from '@/components/ui/sidebar/util.svelte.ts';
    import { getPlatform } from '@/lib/shared/platform';
    import { routes } from '@/components/util/routes';
    import { fade, fly } from 'svelte/transition';
    import { type Snippet } from 'svelte';

    type RootProps = { 
        children?: Snippet 
    }

    let { children }: RootProps = $props()
</script>

<section 
    transition:fly={{ duration: 300 }}
    class="
        {sidebar.isOpen ? 'w-75 sm:w-94' : 'w-0'} {getPlatform() == "windows" ? "pt-titlebar" : "pt-4"}
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
{#if sidebar.isOpen == true}
    <button 
        transition:fade={{duration: 200}} 
        onclick={sidebar.toggle} 
        class="
            bg-black/20 absolute h-full w-full z-9
            lg:hidden
        " 
        aria-label="Button that closes the task editor"
    >
    </button>
{/if}