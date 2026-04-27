<script lang="ts">
    import { paramKeys, paramValues, routes } from "@/components/util/routes";
    import { PanelRightClose, PanelRightOpen } from "@lucide/svelte";
    import { searchParams } from "sv-router";
    import { isActive, p } from "sv-router/generated";
    import type { Snippet } from "svelte";
    import { app } from "@/lib/app/main";

    interface LayoutProps {
        children?: Snippet
    }

    let { children }: LayoutProps = $props()

    // These variables represent the sidebar's current state
    let isSidebarExpanded = $derived(searchParams.get(paramKeys["sidebar"]) == paramValues["sidebar"].expanded)
    let isSidebarCollapsed = $derived(searchParams.get(paramKeys["sidebar"]) == paramValues["sidebar"].collapsed)

    // This function opens the sidebar. 
    function expandSidebar() {
        searchParams.delete(paramKeys["sidebar"])
    }

    // This function closes the editor
    function collapseSidebar() {
        searchParams.delete(paramKeys["sidebar"])
        searchParams.append(paramKeys["sidebar"], paramValues["sidebar"].collapsed)
    }   
</script>

{#if isSidebarExpanded}
    <aside class="
        bg-background p-6 flex flex-col gap-y-6 z-50
        fixed w-screen h-screen
        sm:static sm:min-w-50 sm:h-auto sm:flex-1
        lg:w-130
        {(app.platform === "windows" || app.platform === "android" ) ? "pt-10 sm:pt-12" : ""}
    ">
        <section class="flex justify-between items-center gap-x-4">
            <!-- Title and redirection back to the website's home  -->
            <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-800">            
                <a
                    aria-label="Link to Docket's Homepage"
                    href={routes.get("Home")?.link}
                >
                    Docket
                </a>
            </h1>

            <button 
                onclick={collapseSidebar}
                class="
                    bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer 
                    p-1.5 
                    sm:p-2
                "
            >      
                <PanelRightOpen class="
                    size-4
                    rotate-90
                    sm:rotate-0
                "/>
            </button>
        </section>

        <section class="flex-1 flex flex-col justify-center">
            <h2 class="font-title font-semibold text-lg h-7"> Navigation </h2>

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
        </section> 

        <section class="h-85 max-h-85 overflow-hidden flex flex-col">
            {@render children?.()}
        </section>
    </aside>
{:else if isSidebarCollapsed}
    <aside class="
        bg-background flex flex-col justify-between gap-y-6 p-6
        {(app.platform === "windows" || app.platform === "android" ) ? "pt-10 sm:pt-12" : ""}
    ">
        <section class="flex justify-between items-center gap-x-4">
            <!-- Title and redirection back to the website's home  -->
            <h1 class="
                block font-title text-2xl font-bold text-content-900 hover:text-content-800
                sm:hidden
            ">            
                <a
                    aria-label="Link to Docket's Homepage"
                    href={routes.get("Home")?.link}
                >
                    Docket
                </a>
            </h1>

            <button 
                onclick={expandSidebar}
                class="
                    p-1.5 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer 
                    sm:p-2
                "
            >      
                <PanelRightClose class="
                    size-4
                    rotate-270
                    sm:rotate-0
                "/>
            </button>
        </section>

        <section class="
            hidden pt-8
            sm:flex sm:flex-col sm:gap-y-2
        ">
            {#each routes as [name, {link, icon, hasSidebar}]}
                {@const RouteIcon = icon}
                
                <a 
                    href={hasSidebar ? p(link, {search: {"sidebar": "collapsed"}}) : p(link)} 
                    class="
                        shadow-md rounded-lg cursor-pointer 
                        p-1.5 
                        sm:p-2
                        {isActive(link as any) == true ? "bg-background-100" : "bg-background cursor-pointer hover:bg-background-50"}
                    "
                    aria-label="Link to {name} Page"
                >
                    <RouteIcon class="
                        size-4
                        rotate-90 
                        sm:rotate-0
                    "/>
                </a>
            {/each}
        </section>
    </aside>
{/if}
