<script lang="ts">
    import { colors } from "@/components/util/color";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { ArrowDown, ArrowUp, Notebook } from "@lucide/svelte";
    import { Combobox } from "bits-ui";
    import Checkbox from "./checkbox.svelte";
    import { MAX_PLANNERS } from "@/lib/task/repository";
  
    interface PickerProps {
        value: string[],
        buttonStyle: string,
        pickerStyle: string
    }

    // This receives an array of planners id as a prop, updates from the component update the caller's array.
    let { 
        value = $bindable(), 
        buttonStyle = "bg-background hover:bg-background-100 px-2",
        pickerStyle = "bg-background",
    }: PickerProps = $props()

    // A variable for fetching the list of planners
    const planners: Planner[] = $derived(plannerStore.getList());
    
    // Using the search input, the list of planners are filtered. 
    let searchInput: string = $state("");

    const searchedPlanners: Planner[] = $derived(
        planners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );

    const selectedPlanners: Planner[] = $derived(
        plannerStore.getItemsById(value, true)
    )

    // The minimum number of slots shown on the row of the task's planner grid.
    let colsInPlannerRow = MAX_PLANNERS / 2
</script>

<Combobox.Root
    type="multiple"
    bind:value={value}
    inputValue={searchInput}
    required={true}
    onOpenChangeComplete={(isOpen) => {
        if (!isOpen) searchInput = "";
    }}
>
    <!-- Input to open the combobox options and triggers the combobox search. -->
    <div class="{buttonStyle} flex items-center rounded-lg px-2 text-center gap-x-2">
        <Combobox.Trigger class="cursor-pointer">
            <Notebook class="size-4"/>
        </Combobox.Trigger>

        <!-- Search input to filter through the planners.  -->
        <Combobox.Input
            onclick={(e) => e.stopPropagation()}
            oninput={(e) => searchInput = e.currentTarget.value }
            placeholder="Select a planner..."
            aria-label="Select a planner..."
            class="w-32 border-b hover:border-0 border-background-100 focus:outline-0"
            autocomplete="off"
            clearOnDeselect={true}
            required={value.length <= 0 ? true : false}
        />
        
        <Combobox.Trigger class="
            grid gap-0.5
            grid-cols-5 grid-rows-1
            *:rounded-xs *:size-2
        ">
            {#each {length: MAX_PLANNERS - selectedPlanners.length}, slotNum}
                <!-- This logic ensures that multiple rows aren't shown beyond the amount that is required -->
                {#if slotNum < colsInPlannerRow && selectedPlanners.length <= colsInPlannerRow}
                    <!-- The styling hides slots based on the user using medias such as phones or tablets -->
                    <div class="hidden"> </div>
                {:else}
                    <div class="border border-background-300"> </div>
                {/if}
            {/each}

            {#each selectedPlanners as planner}    
                <div class="flex items-center justify-center bg-{colors[planner.color]}"> 
                </div>
            {/each}
        </Combobox.Trigger>
    </div>

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
                <!-- This is a item to pick the planner -->
                <!-- If selected planners exceed 10 planners, the option to select is deleted. -->
                <Combobox.Item
                    value={planner.id}
                    label={planner.name}
                    class="flex justify-between items-center data-highlighted:bg-background-100 p-1 px-2 cursor-pointer rounded-lg gap-x-2 data-disabled:cursor-not-allowed"
                    disabled={value.length >= MAX_PLANNERS + 1 && !value.includes(planner.id)}
                >   
                    {#snippet children({ selected })}
                        <p class="truncate"> {planner.name} </p> 

                        <Checkbox 
                            value={selected}
                            checkedStyle="size-4 bg-{colors[planner.color]}"
                            unCheckedStyle="size-4 border-{colors[planner.color]}"
                            disabled={value.length >= MAX_PLANNERS + 1 && selected == false}
                        />
                    {/snippet}
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
