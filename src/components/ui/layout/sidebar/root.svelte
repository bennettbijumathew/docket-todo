<script lang="ts">
    import { type RouteDetails, type RouteNames, routes } from "@/components/util/routes";
    import { sidebar } from '@/components/ui/layout/sidebar/util.svelte';
    import { getPlatform } from '@/lib/shared/platform';
    import { isActive, p } from "sv-router/generated";
    import { fade } from 'svelte/transition';
    import { type Snippet } from 'svelte';

    type RootProps = { 
        children?: Snippet 
    }

    let { children }: RootProps = $props()

    /** Routes that are displayed on the sidebar. */
    const sidebarRoutes: Map<RouteNames, RouteDetails>  = new Map();

    sidebarRoutes.set("Home", routes.get("Home")!)
    sidebarRoutes.set("Planner", routes.get("Planner")!)
    sidebarRoutes.set("Task", routes.get("Task")!)
</script>

<section 
    class="
        {getPlatform() == "windows" ? "pt-titlebar" : "pt-4"} 
        {sidebar.isOpen ? 'w-75 sm:w-94' : 'w-0'}
        box-border bg-background flex flex-col justify-between h-full overflow-hidden transition-[width] duration-300 pt-safe
        fixed top-0 left-0 z-10 
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

    <!-- Navigation Panel -->
    <div class="flex-1 flex flex-col justify-center p-4">
        <h2 class="font-title font-semibold text-lg h-7"> Navigation </h2>

        <div class="
            flex flex-col gap-1
        ">
            <!-- This generates a list of routes for the user to access.  -->
            {#each sidebarRoutes as [name, {link, icon}]}
                {@const RouteIcon = icon}

                <!-- Shows unique icon and different highlighting for active / inactive routes. -->
                <a 
                    href={p(link, {search: {sidebar: true}})} 
                    class="
                        flex flex-row items-center gap-x-2 rounded-md transition-color
                        h-8 px-1
                        {isActive(link as any) == true ? "bg-background-100" : "bg-background cursor-pointer hover:bg-background-50"}
                    "
                    aria-label="Link to {name} Page"
                >
                    <RouteIcon class="size-4"/>
                    {name}
                </a>
            {/each}
        </div>
    </div> 

    <div class="h-80 p-4">
        <!-- Renders element that is inside this element. -->
        {@render children?.()}
    </div>
</section>

{#if sidebar.isOpen == true}
    <!-- This is a dark overlay over the app that on clicking it removes the sidebar. -->
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