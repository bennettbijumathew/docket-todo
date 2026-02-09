<script lang="ts">
    import { colors } from "@/lib/helpers/color";
    import { type Task } from "@/lib/task/type";
    import { type Planner } from "@/lib/planner/type";
    import { plannerTaskController } from "@/lib/planner-task/controller";

    const { planners, task }: { planners: Planner[], task: Task } = $props();
    let searchInput: string = $state("")
    
    // This sets an array to a list of planners that are selected and unselected by the task. 
    // This array changes on a state variable changing such as task.planners or planners
    const taskPlanners = $derived(() => {    
        const plannerIds = new Set(task.planners);

        // Returns a planners alongside a selected attribute which sees if task has selected the planner
        return planners.map((item) => ({
            ...item,
            selected: plannerIds.has(item.id)
        }));
    });

    // Using the search input, the list of planners are filtered and then sorted with selected items first.
    const searchedPlanners = $derived(taskPlanners().filter((item) => 
        item.name.toLowerCase().includes(searchInput.toLowerCase()) === true
    ).sort((a, b) => 
        Number(b.selected) - Number(a.selected)
    ))

    function editTaskPlanner(taskId: string, index: number) {
        if (searchedPlanners[index].selected === true) {
            plannerTaskController.removePlannerFromTask(taskId, searchedPlanners[index].id)
        }
        else {
            plannerTaskController.addPlannerFromTask(taskId, searchedPlanners[index].id)
        }
    }

    $inspect(task.planners)
</script>

<input 
    type="text" 
    placeholder="Search for Planners" 
    class="flex w-full border border-background-300 p-1 rounded-lg" 
    bind:value={searchInput}
>

{#if searchedPlanners.length > 0}
    <div class="border border-background-300 rounded-lg p-1 w-full mt-2 max-h-38 overflow-y-auto">
        {#each searchedPlanners as planner, index}
            <button 
                class="flex w-full justify-between border-l-4 first:rounded-tl-sm last:rounded-bl-sm border-{colors[planner.color]} items-center hover:bg-background-50 transition-colors cursor-pointer"
                onclick={() => editTaskPlanner(task.id, index)}
            >
                <p class="ml-1"> {planner.name} </p>

                <input 
                    type="checkbox" 
                    id={planner.id} 
                    checked={task.planners.includes(planner.id)}
                    class="size-4 accent-text-300 mr-1"
                >   
            </button>
        {/each}
    </div>
{/if}