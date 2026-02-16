<script lang="ts">
    import { Check } from "@lucide/svelte";
    import { Popover } from "bits-ui";
    import { type ColorKey, colors } from "@/components/util/color";
    import { type Snippet } from "svelte";

    type positionType = 'top' | 'left' | 'right' | 'bottom'

    // This receives a bounded color key as a prop, updates from the component update the caller's array.
    let { value = $bindable(), position, children }: { value: ColorKey, position: positionType, children?: Snippet } = $props()
</script>
 
<Popover.Root>
    <!-- Button to open the Color Picker -->
    <Popover.Trigger>
        {@render children?.()}
    </Popover.Trigger>

    <!-- Container to hold the color options -->
    <Popover.Portal>
        <Popover.Content 
            class="bg-background-50 border border-background-300 rounded-lg grid grid-cols-4 grids-cols-4 gap-1 p-3"
            sideOffset={15}
            side={position} 
        >
            {#each Object.entries(colors) as [id, color]}
                <button 
                    class="rounded-lg bg-{color} size-6 flex items-center justify-center cursor-pointer" 
                    onclick={() => {value = id as ColorKey}}
                    title="Color Selector Button for {id}"
                    aria-labelledby={id}
                >
                    {#if id as ColorKey === value}
                        <Check class="size-4"/>
                    {/if}
                </button>
            {/each}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>
