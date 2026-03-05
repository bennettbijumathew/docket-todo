<script lang="ts">
    import { routes } from "@/components/util/routes";
    import { ClipboardCheck, Notebook } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    interface SidebarProps {
        children?: Snippet
    }

    let { children }: SidebarProps = $props()
</script>

<aside class="flex flex-col justify-between flex-1 p-4 inset-shadow-l-md">
    <!-- Title and redirection back to the website's home  -->
    <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-600">
        <a 
            aria-label="Link to Docket's Homepage"
            href={routes.get("Home")}
        >
            Docket
        </a>
    </h1>

    <!-- Panel for navigating to different sections of the application.   -->
    <section>
        <h2 class="font-title font-semibold text-lg">
            Navigation
        </h2>

        <nav class="flex flex-col gap-y-0.5">
            <a 
                class="flex items-center gap-x-2 p-1 rounded-md transition-colors bg-background-100 hover:cursor-default"
                aria-label="Link to Tasks Page"
                href={routes.get("Task")}
            > 
                <ClipboardCheck class="size-4"/>

                <p> Tasks </p>
            </a>

            <a 
                class="flex items-center gap-x-2 p-1 rounded-md transition-colors bg-background hover:bg-background-50 hover:cursor-pointer"
                aria-label="Link to Planners Page"
                href={routes.get("Planner")}
            >
                <Notebook class="size-4"/>
                
                <p> Planners </p>
            </a>
        </nav>
    </section>

    <!-- Panel for managing planners -->
    <section>
        {@render children?.()}
    </section>
</aside>
