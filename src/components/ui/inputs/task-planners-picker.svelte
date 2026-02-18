<script lang="ts">
    import { colors, type ColorKey } from "@/components/util/color";
    import { type Task } from "@/lib/task/type";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type TaskPlanner } from "@/lib/planner/type";
    import { taskRepo } from "@/lib/task/repository";
    import { Combobox } from "bits-ui";
    import { ArrowDown, ArrowUp, Check } from "@lucide/svelte";

    const { task: initialTask }: { task: Task } = $props();
    let searchInput: string = $state("");

    // Using the task id from the props, the task is fetched from store to ensure proper reactive state.
    const task = $derived(taskStore.getList().find(t => t.id === initialTask.id) ?? initialTask);

    // Deriving from the planner list, a new planner list is created with a selected attribute.
    const taskPlanners: TaskPlanner[] = $derived(
        plannerStore.getList().map((item) => ({
            ...item,
            selected: task.planners.includes(item.id) || false
        }))
    );

    // Using the search input, the list of planners are filtered.
    const searchedPlanners: TaskPlanner[] = $derived(
        taskPlanners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );

    // This function determines if the planner is removed or added based on the selected value
    function handleSelect(plannerId: string) {
        const planner = taskPlanners.find(p => p.id === plannerId);

        if (!planner) return;

        if (planner.selected) {
            taskRepo.removePlannerFromTask(task.id, plannerId);
        } else {
            taskRepo.addPlannerToTask(task.id, plannerId);
        }
    }
</script>

<Combobox.Root
    type="multiple"
    open={true}
>
    <Combobox.Input
        placeholder="Search for Planners"
        class="flex w-full border border-background-300 p-1 rounded-lg"
        oninput={(e) => (searchInput = e.currentTarget.value)}
    />

    <Combobox.ContentStatic class="border border-background-300 rounded-lg w-(--bits-select-anchor-width) mt-2 max-h-60 overflow-y-auto">
        <!-- Scroll up button for the menu -->    
        <Combobox.ScrollUpButton class="flex justify-center p-2 pb-0 bg-background-50 rounded-lg">
            <ArrowUp class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollUpButton>

        <Combobox.Viewport class="p-2">
            {#each searchedPlanners as planner (planner.id)}
                <Combobox.Item
                    value={planner.id}
                    label={planner.name}
                    class="flex justify-between items-center hover:bg-background-100 p-1 px-2 cursor-pointer rounded-lg"
                    onclick={() => handleSelect(planner.id)}
                >
                    <p> {planner.name} </p> 

                    <!-- Shows a checked checkbox -->
                    {#if planner.selected === true}
                        <div class="bg-{colors[planner.color as ColorKey]} size-4 flex justify-center items-center rounded-xs">
                            <Check 
                                class="size-3 text-content-900"
                                strokeWidth={5}
                            />
                        </div>
                    <!-- Showcases a unchecked checkbox  -->
                    {:else}
                        <div class="border-2 border-{colors[planner.color as ColorKey]} size-4 flex justify-center items-center rounded-xs"></div>
                    {/if} 
                </Combobox.Item>
            {:else}
                <p class="text-sm text-content-400 p-1">No planners found.</p>
            {/each}
        </Combobox.Viewport>

        <!-- Scroll down button for the menu -->
        <Combobox.ScrollDownButton class="flex justify-center p-2 pt-0 bg-background-50 rounded-lg">
            <ArrowDown class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollDownButton>
    </Combobox.ContentStatic>
</Combobox.Root>

