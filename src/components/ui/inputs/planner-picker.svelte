<script lang="ts">
    import { colors, type ColorKey } from "@/components/util/color";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { ArrowDown, ArrowUp, Check, FolderTree } from "@lucide/svelte";
    import { Combobox } from "bits-ui";
  
    // This receives an array of planners id as a prop, updates from the component update the caller's array.
    let { value = $bindable() }: { value: string[] } = $props()

    // A variable for fetching the list of planners
    const planners: Planner[] = $derived(plannerStore.getList());
    
    // Using the search input, the list of planners are filtered. 
    let searchInput: string = $state("");

    const searchedPlanners: Planner[] = $derived(
        planners.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    );
</script>
 
<Combobox.Root
    type="multiple"
    onOpenChangeComplete={(isOpen) => {
        if (!isOpen) searchInput = "";
    }}
    bind:value={value}
>
    <!-- The button that opens combobox options -->
    <Combobox.Trigger class="flex items-center hover:bg-background-100 rounded-lg px-2 text-center gap-x-2 cursor-pointer transition-all">
        <FolderTree class="size-4"/>

        <!-- Search input to filter through the planners  -->
        <Combobox.Input
            oninput={(e) => (searchInput = e.currentTarget.value)}
            placeholder="Select a planner..."
            aria-label="Select a planner..."
            class="w-32 border-b hover:border-0 border-background-100 focus:outline-0"
            clearOnDeselect={true}
            autocomplete="off"
            required
        />
    </Combobox.Trigger>

    <Combobox.Content 
        sideOffset={15} 
        class="border border-background-300 rounded-lg w-full max-h-60 overflow-y-auto"
        side="top"
    >
        <!-- Scroll up button for the menu -->    
        <Combobox.ScrollUpButton class="flex justify-center p-2 pb-0 bg-background-50 rounded-lg">
            <ArrowUp class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollUpButton>

        <Combobox.Viewport class="bg-background-50 p-2 w-60 min-w-(--bits-combobox-anchor-width)">
            {#each searchedPlanners as planner (planner.id)}
                <Combobox.Item
                    value={planner.id}
                    label={planner.name}
                    class="flex justify-between items-center hover:bg-background-100 p-1 px-2 cursor-pointer rounded-lg gap-x-2"
                >
                    {#snippet children({ selected })}
                        <p class="truncate"> {planner.name} </p> 

                        <!-- Shows a checked checkbox -->
                        {#if selected === true}
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
                    {/snippet}
                </Combobox.Item>
            {:else}
                <p class="text-sm text-content-400 p-1">No planners found.</p>
            {/each}
        </Combobox.Viewport>

        <!-- Scroll down button for the menu -->
        <Combobox.ScrollDownButton class="flex justify-center p-2 pt-0 bg-background-50 rounded-lg">
            <ArrowDown class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
        </Combobox.ScrollDownButton>
    </Combobox.Content>
</Combobox.Root>
