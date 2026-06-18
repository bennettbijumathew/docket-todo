<!-- CODE -->
<script lang="ts">
    import SidebarRoot from "@/components/ui/sidebar/sidebar-root.svelte";
    import SidebarRoutes from "@/components/ui/sidebar/sidebar-routes.svelte";
    import PlannerToggleList from "@/components/ui/sidebar/task/planner-toggle-list.svelte";
    import { PanelLeft } from "@lucide/svelte";

    // These are references to components used in the page.
    // Used to call functions within each function such as toggle sidebar etc. 
    let sidebar: ReturnType<typeof SidebarRoot>;
</script>

<!-- This is the sidebar of the application, includes routes and planner toggle list. -->
<SidebarRoot bind:this={sidebar}>
    <SidebarRoutes/>

    <PlannerToggleList/>
</SidebarRoot>

<!-- This is main part of the application where the task list resides -->
<section class="
    flex flex-1 flex-col min-h-0 mt-safe
    lg:flex-3 pt-safe
">
    <!-- The header that holds the title and the button to toggle the sidebar -->

    <header class="
        flex justify-between border-b border-background-300 p-4 shrink-0
        flex-col gap-2
        sm:flex-row sm:gap-2
    ">
        <div class="flex items-center gap-x-2">
            <button 
                onclick={sidebar.toggle}
                aria-label="Toggle the sidebar"
                class="
                    flex items-center gap-x-2 bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer
                    p-2
                    sm:1
                "
            >      
                <PanelLeft class="size-4"/>
            </button>

            <h1 class="font-title font-semibold text-lg"> Task List </h1>
        </div>
    </header>
</section>