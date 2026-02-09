<script lang="ts">
    import { ChevronDown } from "@lucide/svelte";
    import { colors } from "@/lib/helpers/color";
    import { type Task } from "@/lib/task/type";
    import { type Planner } from "@/lib/planner/type";

    const { planners, task }: { planners: Planner[], task: Task } = $props();
    let searchInput: string = $state("")

    // This sets a list of planners that are selected by the task. 
    // This array changes on a state variable changing such as task.planners or planners
    const selectedPlanners = $derived(() => {
        const plannerIds = new Set(task.planners);

        // Returns a planners alongside a selected attribute which sees if task has selected the planner
        return planners.map((item) => ({
            ...item,
            selected: plannerIds.has(item.id)
        }));
    });

    const searchedPlanners = $derived(() => selectedPlanners().filter((item) => 
        item.name.toLowerCase().includes(searchInput) === true
    ))
</script>

<div>
    {#each searchedPlanners() as planner}
        <div class="flex border border-background-300">
            <div class={`bg-${colors[planner.color]} p-0.5`}></div>
            <p class="ml-2"> {planner.name} </p>
        </div>
    {/each}
</div>

<div class="flex justify-between border border-background-300 rounded-lg p-1 w-full">
    <input type="text" placeholder="Search for Planners" class="flex-1" bind:value={searchInput}>

    <ChevronDown class=""></ChevronDown>
</div>

<div>
    {#each searchedPlanners() as planner}
        <div class="flex p-2 justify-between items-center hover:bg-background-50 transition-colors cursor-pointer border-b border-background-300">
            <div class="flex">
                <div class={`bg-${colors[planner.color]} p-0.5`}></div>
                <p class="ml-2"> {planner.name} </p>
            </div>

            <input 
                type="checkbox" 
                id={planner.id} 
                checked={planner.selected}
                class="size-4 accent-text-300"
            >   
        </div>
    {/each}
</div>