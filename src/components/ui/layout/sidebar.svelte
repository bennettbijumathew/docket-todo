<script lang="ts">
    import { routes } from "@/components/util/routes";
    import { isActive } from "sv-router/generated";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet
    }

    let { children }: LayoutProps = $props()
</script>

<aside class="flex flex-col justify-between flex-1 p-4 py-6 gap-y-4">
    <!-- Title and redirection back to the website's home  -->
    <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-600">
        <a 
            aria-label="Link to Docket's Homepage"
            href={routes.get("Home")?.link}
        >
            Docket
        </a>
    </h1>

    <!-- Panel for navigating to different sections of the application.   -->
    <section>
        <h2 class="font-title font-semibold text-lg">
            Navigation
        </h2>

        <nav class="
            flex flex-row gap-2
            sm:gap-0.5 sm:flex-col
        ">
            {#each routes as [name, {link, icon}]}
                {@const RouteIcon = icon}
                
                <a 
                    href={link} 
                    class="
                        flex flex-1 items-center gap-x-2 p-2 rounded-md transition-color
                        sm:flex-none sm:p-1 
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
    <section>
        {@render children?.()}
    </section>
</aside>
