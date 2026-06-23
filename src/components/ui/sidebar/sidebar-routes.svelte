<script lang="ts">
    import { type RouteDetails, type RouteNames, routes } from "@/components/util/routes";
    import { isActive } from "sv-router/generated";

    /** Routes that are displayed on the sidebar. */
    const sidebarRoutes: Map<RouteNames, RouteDetails>  = new Map();

    sidebarRoutes.set("Home", routes.get("Home")!)
    sidebarRoutes.set("Planner", routes.get("Planner")!)
    sidebarRoutes.set("Task", routes.get("Task")!)
</script>

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
                href={link} 
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