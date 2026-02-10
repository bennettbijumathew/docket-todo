<script lang="ts">
    import { colors } from "@/lib/helpers/color";
    import { type Task } from "@/lib/task/type";
    import { plannerTaskController } from "@/lib/planner-task/controller";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type UserPlanner } from "@/lib/planner/type";

    const { task: initialTask }: { task: Task } = $props();
    let searchInput: string = $state("")
    
    // Using the task id from the props, the task is fetched from store to ensure proper reactive state. 
    const task = $derived(taskStore.getList().find(t => t.id === initialTask.id) ?? initialTask);
    
    // Deriving from the planner list, a new planner list is created with a selected attribute.
    // The selected attribute represents the planners that are associated with the task.
    const taskPlanners: UserPlanner[] = $derived(
        plannerStore.getList().map((item) => ({
            ...item,
            selected: task.planners.includes(item.id) || false
        }))
    );

    // Using the search input, the list of planners are filtered. 
    const searchedPlanners: UserPlanner[] = $derived(
        taskPlanners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );

    function editTaskPlanner(plannerId: string, isSelected: boolean) {
        if (isSelected == true) {
            plannerTaskController.removePlannerFromTask(task.id, plannerId);
        } else {
            plannerTaskController.addPlannerFromTask(task.id, plannerId);
        }
    }
</script>

<input 
    type="text" 
    placeholder="Search for Planners" 
    class="flex w-full border border-background-300 p-1 rounded-lg" 
    bind:value={searchInput}
>

{#if searchedPlanners.length > 0}
    <div class="border border-background-300 rounded-lg p-1 w-full mt-2 max-h-38 overflow-y-auto">
        {#each searchedPlanners as planner}
            <button 
                class="flex w-full justify-between border-l-4 first:rounded-tl-sm last:rounded-bl-sm border-{colors[planner.color]} items-center hover:bg-background-50 transition-colors cursor-pointer"
                onclick={() => editTaskPlanner(planner.id, planner.selected)}
            >
                <p class="ml-1"> {planner.name} </p>

                <input 
                    type="checkbox" 
                    id={planner.id} 
                    checked={planner.selected}
                    class="size-4 accent-content-900 mr-1"
                >   
            </button>
        {/each}
    </div>
{/if}
