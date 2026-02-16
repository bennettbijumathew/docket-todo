<script lang="ts">
    import { Check, PaintBucket } from "@lucide/svelte";
    import { Popover } from "bits-ui";
    import { type ColorKey, colors } from "../util/color";

    // This receives a bounded color key as a prop, updates from the component update the caller's array.
    let { value = $bindable() }: { value: ColorKey } = $props()
</script>
 
<Popover.Root>
    <!-- Button to open the Color Picker -->
    <Popover.Trigger class="flex items-center rounded-lg px-2 hover:opacity-90 text-center gap-x-2 cursor-pointer transition-all bg-{colors[value]}">
        <PaintBucket class="size-4"/>

        <p>{value.charAt(0).toUpperCase()}{value.slice(1)}</p>
    </Popover.Trigger>

    <!-- Container to hold the color options -->
    <Popover.Portal>
        <Popover.Content 
            class="border border-background-300 rounded-lg grid grid-cols-4 grids-cols-4 gap-1 p-3 mx-8"
            sideOffset={25}
            side="top" 
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
