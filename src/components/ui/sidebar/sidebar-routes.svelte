<script lang="ts">
    import { type RouteDetails, type RouteNames, type RoutePath, routes } from "@/components/util/routes";
    import { type Icon } from "@lucide/svelte";
    import { isActive } from "sv-router/generated";

    const sidebarRoutes: Map<RouteNames, RouteDetails>  = new Map();

    sidebarRoutes.set("Home", routes.get("Home")!)
    sidebarRoutes.set("Planner", routes.get("Planner")!)
    sidebarRoutes.set("Task", routes.get("Task")!)
</script>

{#snippet routeTile(name: RouteNames, link: RoutePath, icon: typeof Icon)}
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

{/snippet}

<div class="flex-1 flex flex-col justify-center p-4">
    <h2 class="font-title font-semibold text-lg h-7"> Navigation </h2>

    <div class="flex flex-col gap-1">
        {#each sidebarRoutes as [name, {link, icon}]}
            {@render routeTile(name, link, icon)}
        {/each}
    </div>
</div> 
