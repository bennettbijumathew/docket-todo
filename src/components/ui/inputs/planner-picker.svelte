<script lang="ts">
    import { colors } from "@/components/util/color";
    import { planners } from "@/lib/planner/store.svelte";
    import { ArrowDown, ArrowUp, Notebook } from "@lucide/svelte";
    import { Select } from "bits-ui";
    import Checkbox from "./checkbox.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import { MAX_PLANNERS } from "@/lib/task/repository";
    
    type PlannerPickerProps = { 
        value: SvelteSet<string> 
    }

    let { value = $bindable() }: PlannerPickerProps = $props()

    /** A derived list of item */
    const items = $derived(planners.all.map((item) => {
        return {
            value: item.id, 
            label: item.name 
        }
    }))
</script>
 
<Select.Root 
    type="multiple" 
    items={items} 
    onValueChange={(changedValues) => {
        value = new SvelteSet([...changedValues])
    }}

    allowDeselect={true}
>
    <Select.Trigger
        class="flex items-center gap-x-4 border border-background-300 hover:border-background-400 rounded-lg cursor-pointer p-1 outline-none"
        aria-label="Select a list of planners"
    >
        <Notebook class="size-4 mx-1"/>

        <Select.Value
            placeholder="Select a planner"
            class="flex items-center justify-between flex-row gap-x-0.5"
        >
            {#snippet child({ selection, placeholder })}
                <div class="
                    flex flex-row-reverse gap-0.5 
                    w-29 flex-wrap
                    sm:w-54 sm:flex-nowrap
                "> 
                    {#if selection.type === "multiple" && selection.selected.length > 0}
                        {#each selection.selected as selectedPlanner (selectedPlanner.value)}
                            {@const planner = planners.get({id: selectedPlanner.value})}
                            
                            {#if planner}
                                <p class="h-5 w-5 flex items-center justify-center py-1 bg-{colors[planner.color]} shrink-0 text-xs rounded-md">
                                    {selectedPlanner.label[0]}
                                </p>
                            {/if}
                        {/each}
                    {:else}
                        <p class="h-5 flex items-center text-content-600 text-left">
                            {placeholder}
                        </p>
                    {/if}
                </div>
            {/snippet}
        </Select.Value>
    </Select.Trigger>

    <Select.Content
        sideOffset={10}
        class="h-60 bg-background shadow-md rounded-lg p-1"
    >
        <Select.ScrollUpButton class="flex items-center justify-center py-1 rounded-lg hover:bg-background-100">
            <ArrowUp class="size-4" />
        </Select.ScrollUpButton>

        <Select.Viewport class="w-(--bits-select-anchor-width) ">
            {#each items as item, i (i + item.value)}
                {@const isSelectedOverMax = value.size >= MAX_PLANNERS && !value.has(item.value)}

                <Select.Item
                    class="flex items-center justify-between data-highlighted:bg-background-100 cursor-pointer p-1 px-2 rounded-lg"
                    value={item.value}
                    label={item.label}
                    aria-label="Option to select the '{item.label}' planner"
                    disabled={isSelectedOverMax}
                >
                    {#snippet children({ selected })}
                        {@const planner = planners.get({id: item.value})}

                        {#if planner}
                            <p> {planner.name} </p>

                            <Checkbox
                                value={selected}
                                checkedStyle="size-5 bg-{colors[planner.color]} border border-{colors[planner.color]}"
                                unCheckedStyle="size-5 border border-{colors[planner.color]}"
                                disabled={isSelectedOverMax}
                            />
                        {/if}
                    {/snippet}
                </Select.Item>
            {/each}
        </Select.Viewport>

        <Select.ScrollDownButton class="flex items-center justify-center py-1 rounded-lg hover:bg-background-100">
            <ArrowDown class="size-4" />
        </Select.ScrollDownButton>
    </Select.Content>
</Select.Root>