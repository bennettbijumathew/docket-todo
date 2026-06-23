<!-- CODE -->
<script lang="ts">
    import ScrollSection from "@/components/ui/layout/containers/scroll-section.svelte";
    import SidebarRoot from "@/components/ui/sidebar/sidebar-root.svelte";
    import SidebarRoutes from "@/components/ui/sidebar/sidebar-routes.svelte";
    import PlannerToggleList from "@/components/ui/sidebar/task/planner-toggle-list.svelte";
    import TaskList from "@/components/ui/task/task-list.svelte";
    import { tasks } from "@/lib/task/store.svelte";
    import { ArrowDown, ArrowUp, FunnelIcon, PanelLeft, SearchIcon } from "@lucide/svelte";

    /** These are references to components used in the page.
    It is used to call functions within each function such as toggle sidebar etc. */
    let sidebar: ReturnType<typeof SidebarRoot>;
    let list: ReturnType<typeof TaskList>;

    /** This is the variable that tracks the search input and searched tasks. */
    let searchInput: string = $state("")

    /** This is a task list that filters by names that are similar to the search input  */
    const searchedTasks = $derived.by(() => {
        const search = searchInput.trim().toLowerCase();
        if (!search) {
            return tasks.all;
        }
        return tasks.all.filter((task) => 
            task.name.toLowerCase().includes(search)
        );
    });
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
        lg:flex-row sm:gap-2
    ">
        <div class="flex items-center gap-x-2">
            <button 
                onclick={() => sidebar.toggle()}
                aria-label="Toggle the sidebar"
                class="flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer size-8"
            >      
                <PanelLeft class="size-4"/>
            </button>

            <h1 class="font-title font-semibold text-lg"> Task List </h1>
        </div>


        <div class="flex items-center gap-x-2">
            <div class="relative flex-1">
                <SearchIcon
                    class="absolute left-2 top-1/2 size-4 -translate-y-1/2 pointer-events-none"
                />

                <input
                    bind:value={searchInput}
                    class="
                        h-8 bg-background-100 hover:bg-background-200 rounded-lg pl-7.5 pr-2 cursor-pointer
                        w-full
                        sm:flex-1 
                        lg:flex-none lg:w-60
                    "
                    placeholder="Search for tasks"
                    aria-placeholder="Search for tasks"
                />
            </div>
            
            <button 
                onclick={() => list.toggleSort()}
                aria-label="Toggle the sorting mode of the task list"
                class="
                    h-8 flex items-center justify-between gap-x-1 bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer px-2
                    w-32
                    sm:w-34
                "
            >
                <FunnelIcon class="size-4"/>

                <p class="
                    flex items-center gap-x-1
                ">
                    {#if tasks.sortType == "completed"}
                        Completed
                    {:else if tasks.sortType == "due-date-asc"}
                        Due Date
                        <ArrowUp class="size-3"/>
                    {:else if tasks.sortType == "due-date-desc"}
                        Due Date
                        <ArrowDown class="size-3"/>
                    {:else if tasks.sortType == "all"}
                        All
                        <ArrowDown class="size-3"/>
                    {/if}
                </p>
            </button>

        </div>
    </header>

    <!-- The area that holds the task list. -->
    <ScrollSection
        rootClasses="flex-1 min-h-0 h-full"
        viewportClasses="h-full p-4"
    >
        <TaskList 
            list={searchedTasks} 
            sortBy={tasks.sortType}
            bind:this={list}
        />
    </ScrollSection>

    <!-- This is the form to submit new tasks -->
    <form
        class="flex flex-col border-t border-background-300 shrink-0 pb-safe p-4"
        onsubmit={(e) => { 
            e.preventDefault(); 
        }}
    >

    </form>
</section>