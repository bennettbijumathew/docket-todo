<script lang="ts">
    import { colors } from "@/components/util/color";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { Check, FolderTree } from "@lucide/svelte";
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
        >
        
        </Combobox.Input>   
    </Combobox.Trigger>
    
    <Combobox.Portal>
        <Combobox.Content 
            sideOffset={25}
            side="top" 
            class="border border-background-300 bg-background-50 rounded-lg mx-8"
        >
            <Combobox.Viewport class="flex flex-col items-center p-3 w-50 max-h-50 overflow-y-auto">
                {#if searchedPlanners.length > 0}
                    {#each searchedPlanners as planner, i (i + planner.id)}
                        <Combobox.Item
                            value={planner.id}
                            label={planner.name}
                            class="flex items-center justify-between w-full border-l-4 first:rounded-tl-sm last:rounded-bl-sm border-{colors[planner.color]} items-center hover:bg-background-50 transition-colors cursor-pointer"
                            
                        >
                            {#snippet children({ selected })}
                                <p class="ml-2"> {planner.name} </p>

                                {#if selected}
                                    <div class="bg-content-900 size-4 flex justify-center items-center rounded-xs">
                                        <Check 
                                            class="size-3 text-background-100"
                                            strokeWidth={5}
                                        />
                                    </div>
                                {:else}
                                    <div class="border border-content-900 size-4 rounded-xs"></div>
                                {/if}
                            {/snippet}
                        </Combobox.Item>
                    {/each}
                {:else}
                    <div class="flex items-center justify-center w-full">
                        <p> No results found </p>
                    </div>
                {/if}
            </Combobox.Viewport>
        </Combobox.Content>
    </Combobox.Portal>
</Combobox.Root>
