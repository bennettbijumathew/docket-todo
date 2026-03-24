<script lang="ts">
    import { colors } from "@/components/util/color";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { ArrowDown, ArrowUp, Notebook } from "@lucide/svelte";
    import { Combobox } from "bits-ui";
    import Checkbox from "./checkbox.svelte";
    import { MAX_PLANNERS } from "@/lib/task/repository";
    import { SvelteSet } from "svelte/reactivity";
    import { toast } from "svelte-sonner";
  
    // This receives an array of planners id as a prop, updates from the component update the caller's array.
    interface PickerProps {
        value: SvelteSet<string>,
        buttonStyle: string,
        pickerStyle: string
    }

    let { 
        value = $bindable(), 
        buttonStyle = "bg-background hover:bg-background-100 px-2",
        pickerStyle = "bg-background",
    }: PickerProps = $props()


    // A variable for fetching the list of planners
    const planners: Planner[] = $derived(plannerStore.getList());
    
    // Gets a list of planners selected by the user. It shows hidden and visible planners. 
    const selectedPlanners: Planner[] = $derived(
        plannerStore.getItemsById(value, true)
    )

    // Using the search input, the list of planners are filtered. 
    let searchInput: string = $state("");

    const searchedPlanners: Planner[] = $derived(
        planners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );


    // Utility variables / function that is used for validation of code and user interface.
    const isSelectedPlannersOverMax = $derived(selectedPlanners.length >= MAX_PLANNERS);
    const isPlannerSelected = (plannerId: string) => value.has(plannerId);
    const isPlannerDisabled = (plannerId: string) => isSelectedPlannersOverMax == true && isPlannerSelected(plannerId) == false;


    // Submit function to handle changes to the list of selected planners. 
    function handleSubmit(plannerId: string): void {
        if (isPlannerSelected(plannerId) == true) {
            value.delete(plannerId)
        } 
        else {
            if (!isSelectedPlannersOverMax == true) {
                value.add(plannerId)
            } 
            else {
                toast.error(`A task is only allowed to hold ${MAX_PLANNERS} planners.`)
            }
        }
    }
</script>

{#snippet colorGrid()}
    <!-- The minimum number of slots shown on the row of the task's planner grid. -->
    {@const colsInPlannerRow = MAX_PLANNERS / 2}

    <div class="
        grid grid-cols-5 grid-rows-1 *:rounded-xs *:size-2 select-none
        gap-2
        sm:gap-0.5
    ">
        {#each {length: MAX_PLANNERS - selectedPlanners.length}, slotNum}
            <!-- This logic ensures that multiple rows aren't shown beyond the amount that is required -->
            <!-- The styling hides slots based on the user using medias such as phones or tablets -->
            {#if slotNum < colsInPlannerRow && selectedPlanners.length <= colsInPlannerRow}
                <div class="hidden"> </div>
            {:else}
                <div class="border border-background-300"> </div>
            {/if}
        {/each}

        {#each selectedPlanners as planner}    
            <div class="flex items-center justify-center bg-{colors[planner.color]}"> </div>
        {/each}
    </div>
{/snippet}

<Combobox.Root
    type="multiple"
    inputValue={searchInput}
    required={true}
    onOpenChangeComplete={(isOpen) => {
        if (!isOpen) searchInput = "";
    }}
>
    <!-- Input to open the combobox options and triggers the combobox search. -->
    <Combobox.Trigger class="{buttonStyle} flex items-center justify-between rounded-lg text-center gap-x-2 cursor-pointer">
        <Notebook class="size-4"/>

        <!-- Search input to filter through the planners.  -->
        <Combobox.Input
            onclick={(e) => e.stopPropagation()}
            oninput={(e) => searchInput = e.currentTarget.value }
            placeholder="Select a planner..."
            aria-label="Select a planner..."
            class="flex-1 w-32 border-background-100 focus:outline-0"
            autocomplete="off"
            clearOnDeselect={true}
            required={value.size <= 0 ? true : false}
        />

        {@render colorGrid()}
    </Combobox.Trigger>

    <!-- The content that is shown once the trigger is pressed. -->
    <Combobox.Content 
        sideOffset={25} 
        collisionPadding={25}
        class="{pickerStyle} rounded-lg w-full max-h-60 overflow-y-auto"
        side="top"
    >
        <!-- Scroll up button for the menu -->    
        <Combobox.ScrollUpButton class="flex justify-center p-2 pb-0 bg-background rounded-lg">
            <ArrowUp class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollUpButton>

        <!-- The main content for the menu -->
        <Combobox.Viewport class="bg-background p-2 w-60 min-w-(--bits-combobox-anchor-width)">
            {#each searchedPlanners as planner (planner.id)}
                <!-- If selected planners exceed 10 planners, the option to select is deleted. -->
                <Combobox.Item
                    value={planner.id}
                    label={planner.name}
                    class="flex justify-between items-center data-highlighted:bg-background-100 p-1 px-2 cursor-pointer rounded-lg gap-x-2 data-disabled:cursor-not-allowed"
                    disabled={isPlannerDisabled(planner.id)}
                    onclick={() => handleSubmit(planner.id)}
                >   
                    <p class="truncate flex-1"> {planner.name} </p> 

                    <Checkbox 
                        value={value.has(planner.id)}
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
