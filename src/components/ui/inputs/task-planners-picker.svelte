<script lang="ts">
    import { colors } from "@/components/util/color";
    import { type Task } from "@/lib/task/type";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type TaskPlanner } from "@/lib/planner/type";
    import { taskRepo } from "@/lib/task/repository";
    import { Combobox } from "bits-ui";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { ArrowDown, ArrowUp, X } from "@lucide/svelte";

    // This picker receives a task as a prop to show planners related to the task
    // The onchange function determines what changes in input should do
    interface PickerProps {
        task: Task,
        onChangeFn: (taskPlanner: TaskPlanner | null) => void,
        buttonStyle: string, 
        pickerStyle: string
    }

    const { 
        task: initialTask, 
        onChangeFn,
        buttonStyle = "bg-background hover:bg-background-100",
        pickerStyle = "bg-background",
    }: PickerProps = $props();

    // This variable is the maximum amount of planners that can be added to a task. The limit is placed as
    // as there is a limit of items for Firebase's array-contains-any query.
    const MAX_PLANNERS = 10

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

    // Deriving from the task related planners, a list is created with only selected planners for a task.
    const selectedTaskPlanners = $derived(
        taskPlanners.filter((item) => item.selected === true)
    )

    // This function determines if the planner is removed or added based on the selected value
    function handleSelect(plannerId: string) {
        const planner = taskPlanners.find(p => p.id === plannerId);

        onChangeFn(planner ?? null)
    }
</script>

<Combobox.Root
    type="multiple"
    open={true}
>
    <Combobox.Trigger class="{buttonStyle} rounded-lg w-full flex flex-col"> 
        <!-- A group of selected Planners -->
        <div class="w-full flex flex-1 flex-wrap gap-1 p-1.5">   
            {#each taskPlanners.filter(p => p.selected) as planner}
                <span class="flex items-center gap-x-3 bg-{colors[planner.color]} rounded-sm px-1.5 py-0.5 text-sm font">                    
                    {planner.name}

                    <button 
                        onclick={() => taskRepo.removePlannerFromTask(task.id, planner.id)} 
                        class="hover:opacity-50 rounded-full p-0.5 cursor-pointer"
                    >
                        <X class="size-3"/>
                    </button>
                </span>
            {/each}
        </div>
        
        <!-- Input for searching the list of planners -->
        <Combobox.Input
            placeholder="Search for Planners"
            class="flex flex-1 p-1.5 focus:outline-none border-dotted border-t border-background-200"
            oninput={(e) => (searchInput = e.currentTarget.value)}
            autocomplete="off"
        />
    </Combobox.Trigger>

    <Combobox.Content 
        sideOffset={5} 
        class="{pickerStyle} rounded-lg w-full max-h-60 overflow-y-auto"
    >
        <!-- Scroll up button for the menu -->    
        <Combobox.ScrollUpButton class="flex justify-center p-2 pb-0 bg-background rounded-lg">
            <ArrowUp class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollUpButton>

        <Combobox.Viewport class="p-2 w-(--bits-combobox-anchor-width)">
            {#each searchedPlanners as planner (planner.id)}
                <!-- This is a item to pick the planner -->
                <!-- If selected planners exceed 10 planners, the option to select is deleted. -->
                <Combobox.Item
                    value={planner.id}
                    label={planner.name}
                    class="flex justify-between items-center data-highlighted:bg-background-100 p-1 px-2 cursor-pointer rounded-lg gap-x-2 data-disabled:cursor-not-allowed"
                    disabled={selectedTaskPlanners.length >= MAX_PLANNERS && !selectedTaskPlanners.map(item => item.id).includes(planner.id)}
                    onclick={() => {
                        if (!(selectedTaskPlanners.length >= MAX_PLANNERS && !selectedTaskPlanners.map(item => item.id).includes(planner.id))) {
                            handleSelect(planner.id)
                        }
                    }}  
                >   
                    <p class="truncate"> {planner.name} </p> 
                    
                    <Checkbox 
                        value={planner.selected}
                        checkedStyle="size-4 bg-{colors[planner.color]}"
                        unCheckedStyle="size-4 border-{colors[planner.color]}"
                        disabled={selectedTaskPlanners.length >= MAX_PLANNERS && planner.selected == false}
                    />
                </Combobox.Item>
            {:else}
                <p class="text-content-400 p-1">No planners found.</p>
            {/each}
        </Combobox.Viewport>

        <!-- Scroll down button for the menu -->
        <Combobox.ScrollDownButton class="flex justify-center p-2 pt-0 bg-background rounded-lg">
            <ArrowDown class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollDownButton>
    </Combobox.Content>
</Combobox.Root>

