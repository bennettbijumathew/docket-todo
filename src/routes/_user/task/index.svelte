<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { plannerTaskController } from "@/lib/planner-task/controller";
    import { type Task } from "@/lib/task/type";
    import dayjs from "dayjs";
    import { colors } from "@/lib/helpers/color";
    import PlannerSelect from "@/components/planner/planner-select.svelte";
    import { ChevronDown, ChevronRight } from "@lucide/svelte";

    // These variables are used to show the tasks of the user.
    const completeTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === true))
    const incompleteTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === false))

    // These variables are responsible for showing the incomplete and complete tasks.
    let isIncompleteTasksShown: boolean = $state(true)
    let isCompleteTasksShown: boolean = $state(false)

    // These variables are used for handling the state of the task editing modal.
    let isEditModalOpen: boolean = $state(true)
    let editedTask: Task | null = $state(null)

    // This function toggles the task editing modal.
    function showTask(task: Task | null) {
        // Exits the modal if the user has pressed on the same task of 
        if (editedTask === task || task === null) {
            isEditModalOpen = false
            editedTask = null
            return; 
        }

        editedTask = task
        isEditModalOpen = true
    }

</script>

<!-- This is task tile snippet that is used to show a single task -->
{#snippet taskTile(task: Task)}
    <button
        onclick={() => showTask(task)} 
        class="flex justify-between items-center h-13 border-b border-dotted border-background-300 hover:bg-background-50 cursor-pointer p-2"
    >
        <section class="flex items-center gap-x-1 text-left">
            <input 
                type="checkbox" 
                class="m-2 ml-0 size-4 accent-content-900"
                id={task.id} 
                checked={task.completed} 
            >   

            <div>
                <h3 class="font-bold"> {task.name} </h3>
                <p class="text-sm"> Due Date: {task.dueDate.format("dddd D, MMMM YYYY")} </p>
            </div>
        </section>

        <div class="flex gap-x-2">
            <span class="flex items-center">
                {#each plannerStore.getItemsById(task.planners, false) as taskPlanner}    
                    <div class="text-sm font-light bg-{colors[taskPlanner.color]} h-4 w-6"> </div>
                {/each}
            </span>
        </div>
    </button>
{/snippet}

<!-- This is what is shown on the arrival of the page -->
<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0">
    <section class="flex-1 border border-background-300 rounded-xl p-4 flex flex-col min-h-0">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Planner</h2>

        <div class="flex flex-col flex-1 overflow-y-auto">
            {#each plannerStore.getList() as planner}
                <button 
                    class={`flex min-h-13 justify-between items-center border-l-10 border-${colors[planner.color]} hover:bg-background-50 transition-colors cursor-pointer`}
                    onclick={() => plannerTaskController.updatePlannerVisibility(authStore.getUserId(), planner.id, !planner.users[authStore.getUserId()])}
                >
                    <p class="ml-2"> {planner.name} </p>

                    <input 
                        type="checkbox" 
                        id={planner.id} 
                        checked={planner.users[authStore.getUserId()]} 
                        class="m-2 size-4 accent-content-900"
                    >   
                </button>
            {/each}
        </div>
    </section>

    <section class="flex flex-col gap-y-4 flex-4 border border-background-300 rounded-xl p-4">
        <h2 class="font-default font-semibold text-xl text-center">Task</h2>

        <div class="flex-1 flex flex-col gap-y-4"> 
            <div class="flex flex-col">
                <!-- Toggle to show the list of incomplete tasks -->
                <button 
                    onclick={() => isIncompleteTasksShown = !isIncompleteTasksShown}
                    class="flex w-fit mb-1 px-2 gap-x-2 items-center border-b-2 border-background-100 hover:border-background-300 transition-colors cursor-pointer"
                >
                    {#if isIncompleteTasksShown == true}
                        <ChevronDown class="size-4"/>
                    {:else}
                        <ChevronRight class="size-4"/>
                    {/if}
                    
                    Incomplete Tasks
                </button>
            
                <!-- Shows a list of complete tasks -->
                {#if isIncompleteTasksShown === true}  
                    {#each incompleteTasks as task}
                        {@render taskTile(task)}
                    {/each}
                {/if}
            </div>

            <div class="flex flex-col">
                <!-- Toggle to show the list of complete tasks -->
                <button 
                    onclick={() => isCompleteTasksShown = !isCompleteTasksShown}
                    class="flex w-fit mb-1 px-2 gap-x-2 items-center border-b-2 border-background-100 hover:border-background-300 transition-colors cursor-pointer"
                >
                    {#if isCompleteTasksShown == true}
                        <ChevronDown class="size-4"/>
                    {:else}
                        <ChevronRight class="size-4"/>
                    {/if}
                    
                    Complete Tasks
                </button>
            
                <!-- Shows a list of complete tasks -->
                {#if isCompleteTasksShown === true}  
                    {#each completeTasks as task}
                        {@render taskTile(task)}
                    {/each}
                {/if}
            </div>
        </div>

        <div>
            <input 
                type="text" 
                class="border border-background-300 rounded-lg p-1"
            >
        </div>
    </section>

    {#if isEditModalOpen == true && editedTask != null}
        <section class="flex-1 flex flex-col gap-y-4 border border-background-300 rounded-xl p-4">
            <h2 class="font-default font-semibold text-xl text-center pb-4">Edit Task</h2>

            <div>
                <p class="font-bold">Title</p>
                <input 
                    type="text" 
                    value={editedTask.name}
                    class="border border-background-300 rounded-lg p-1 w-full"
                >
            </div>

            <div>
                <p class="font-bold">Due Date</p>
                <input 
                    type="date" 
                    value={editedTask.dueDate.format("YYYY-MM-DD")}
                    class="border border-background-300 rounded-lg p-1 w-full"
                    min={dayjs().format("YYYY-MM-DD")}
                >
            </div>

            <div>
                <p class="font-bold">Planner</p>

                <PlannerSelect 
                    task={editedTask}
                />
            </div>
        </section>
    {/if}
</main>