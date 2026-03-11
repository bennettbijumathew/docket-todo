<script lang="ts">
    import { getPlatform } from "@/components/util/platform";
    import { routes } from "@/components/util/routes";
    import { PanelRightClose, PanelRightOpen } from "@lucide/svelte";
    import { isActive } from "sv-router/generated";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet
    }

    let { children }: LayoutProps = $props()

    // This handles the opening and closing of the sidebar.
    let isSidebarCollapsed = $state(false)

    function toggleSidebar() {
        isSidebarCollapsed = !isSidebarCollapsed
    }
</script>

<aside class="
    bg-background top-0 left-0 right-0 p-6 flex flex-col justify-between
    sm:max-w-50 lg:max-w-90 
    {isSidebarCollapsed ? "absolute sm:static w-full h-full sm:w-auto" : "sticky flex-none sm:flex-1"}
">
    <div class="flex justify-between items-center gap-x-4">
        <!-- Title and redirection back to the website's home  -->
        <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-600">
            <a 
                aria-label="Link to Docket's Homepage"
                href={routes.get("Home")?.link}
            >
                Docket
            </a>
        </h1>

        <button 
            class="p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer block sm:hidden"
            onclick={toggleSidebar}
        >      
            {#if isSidebarCollapsed === true}
                <PanelRightOpen class="size-4"/>
            {:else}
                <PanelRightClose class="size-4"/>
            {/if}
        </button>
    </div>

    <!-- Panel for navigating to different sections of the application.   -->
    <section class="{isSidebarCollapsed ? "" : "hidden sm:block"}">
        <h2 class="font-title font-semibold text-lg"> Navigation </h2>

        <nav class="flex gap-0.5 flex-col">
            {#each routes as [name, {link, icon}]}
                {@const RouteIcon = icon}
                
                <a 
                    href={link} 
                    class="
                        flex flex-row items-center gap-x-2 p-2 rounded-md transition-color
                        sm:p-1
                        {isActive(link as any) == true ? "bg-background-100" : "bg-background cursor-pointer hover:bg-background-50"}
                    "
                    aria-label="Link to {name} Page"
                >
                    <RouteIcon class="size-4"/>
                    
                    {name}
                </a>
            {/each}
        </nav>
    </section>

    <!-- Panel for managing planners -->
    <section class="{isSidebarCollapsed ? "" : "hidden sm:block"}">
        {@render children?.()}
    </section>
</aside>
