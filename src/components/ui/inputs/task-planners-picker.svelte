<script lang="ts">
    import { colors } from "@/components/util/color";
    import { type Task } from "@/lib/task/type";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { MAX_PLANNERS } from "@/lib/task/repository";
    import { Combobox } from "bits-ui";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { ArrowDown, ArrowUp, X } from "@lucide/svelte";
    import { toast } from "svelte-sonner";

    // This picker receives a task as a prop to show planners related to the task
    // The onchange function determines what changes in input should do
    interface PickerProps {
        task: Task,
        addPlannerFn: (plannerId: string) => void,
        removePlannerFn: (plannerId: string) => void,
        buttonStyle: string, 
        pickerStyle: string
    }

    const { 
        task: initialTask, 
        addPlannerFn,
        removePlannerFn,
        buttonStyle = "bg-background hover:bg-background-100",
        pickerStyle = "bg-background",
    }: PickerProps = $props();

    
    // Using the task id from the props, the task is fetched from store to ensure proper reactive state.
    const task = $derived(taskStore.getList().find(t => t.id === initialTask.id) ?? initialTask);
    
    // Create a variable that derives from the planner list.
    const taskPlanners: Planner[] = $derived(plannerStore.getList());
    
    // Deriving from the task related planners, a list is created with only selected planners for a task.
    const selectedTaskPlanners = $derived(
        taskPlanners.filter((item) => isPlannerSelected(item.id) == true)
    );


    // Using the search input, the list of planners are filtered.
    let searchInput: string = $state("");

    const searchedPlanners: Planner[] = $derived(
        taskPlanners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );


    // Utility variables / function that is used for validation of code and user interface.
    const isSelectedPlannersOverMax = $derived(selectedTaskPlanners.length >= MAX_PLANNERS);
    const isPlannerSelected = (plannerId: string) => task.planners.has(plannerId);
    const isPlannerDisabled = (plannerId: string) => isSelectedPlannersOverMax == true && isPlannerSelected(plannerId) == false;


    // Submit function for changes in the picker. 
    function handleSubmit(plannerId: string): void {
        if (isPlannerSelected(plannerId) == true) {
            removePlannerFn(plannerId)
        } 
        else {
            if (isSelectedPlannersOverMax == false) {
                addPlannerFn(plannerId)
            } 
            else {
                toast.error(`A task is only allowed to hold ${MAX_PLANNERS} planners.`)
            }
        }
    }
</script>

<Combobox.Root
    type="multiple"
    open={true}
>
    <Combobox.Trigger class="{buttonStyle} rounded-lg w-full flex flex-col"> 
        <!-- A group of selected Planners -->
        <div class="w-full flex flex-1 flex-wrap gap-1 p-1.5">   
            {#each selectedTaskPlanners as planner}
                <span class="
                    flex items-center text-left gap-x-3 rounded-sm px-1.5 py-px text-sm font border border-{colors[planner.color]}
                    { planner.visible == true ? `bg-${colors[planner.color]}` : `bg-transperant` }
                ">                    
                    {planner.name}

                    <button 
                        onclick={() => removePlannerFn(planner.id)} 
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
                    disabled={isPlannerDisabled(planner.id)}
                    onclick={() => handleSubmit(planner.id)}
                >   
                    <p class="truncate flex-1"> 
                        {planner.name} 
                    </p> 
                    
                    <Checkbox 
                        value={isPlannerSelected(planner.id)}
                        checkedStyle="size-4 bg-{colors[planner.color]}"
                        unCheckedStyle="size-4 border-{colors[planner.color]}"
                        disabled={isPlannerDisabled(planner.id)}
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

