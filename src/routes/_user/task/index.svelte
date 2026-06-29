<!-- CODE -->
<script lang="ts">
    import TaskSidebar from "@/components/ui/task/task-sidebar.svelte";
    import { ArrowDown, ArrowUp, FunnelIcon, PanelLeft, SearchIcon } from "@lucide/svelte";
    import ScrollSection from "@/components/ui/layout/containers/scroll-section.svelte";
    import TaskEditor from "@/components/ui/task/task-editor.svelte";
    import TaskInputs from "@/components/ui/task/task-inputs.svelte";
    import { sidebar } from "@/components/ui/layout/sidebar/util.svelte";
    import TaskList from "@/components/ui/task/task-list.svelte";
    import { getPlatform } from "@/lib/shared/platform";
    import { tasks } from "@/lib/task/store.svelte";

    /** References to task list, this enables functions from the components to be used */
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
<TaskSidebar/>

<!-- This is main part of the application where the task list resides. -->
<section class="
    flex flex-1 flex-col min-h-0 pt-safe pb-safe
    lg:flex-3
">
    <!-- The header that holds the title and buttons for toggling the sidebar, searching and filtering tasks.  -->
    <header 
        class="
            {getPlatform() == "windows" ? "pt-titlebar" : ""}
            flex justify-between border-b border-background-300 p-4 shrink-0 
            flex-col gap-2
            lg:flex-row sm:gap-2
        "
    >
        <!-- The title and sidebar toggle -->
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

        <!-- The search and sort toggle button. -->
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
        class="flex-1 min-h-0 h-full"
        viewportClasses="h-full p-4"
    >
        <!-- The task list shows a list of headers based on sort type and shows a list based on the sorted grouping -->
        <TaskList 
            bind:this={list}
            list={searchedTasks} 
            sortBy={tasks.sortType}
        />
    </ScrollSection>

    <!-- This is the form to submit new tasks. -->
    <TaskInputs/>
</section>

<TaskEditor/>
