<script lang="ts">
    import { Check, PaintBucket } from "@lucide/svelte";
    import { Popover } from "bits-ui";
    import { type ColorKey, colors } from "@/components/util/color";

    interface PageProps {
        value: ColorKey, 
        onChangeFn: (color: ColorKey) => void
        alignment?: "start" | "center" | "end"
        position?: "top" | "left" | "right" | "bottom",
        offset?: number,
        buttonClass?: string
        popoverClass?: string
    }

    let { 
        value, 
        onChangeFn,
        alignment = "center",
        position = "top", 
        offset = 15,
        buttonClass = "h-full w-27 px-2",
        popoverClass = "grid gap-1 grid-cols-4 grid-row-4 mx-8"
    }: PageProps = $props()
</script>
 
<Popover.Root>
    <!-- Button to open the Color Picker -->
    <Popover.Trigger class="{buttonClass} bg-{colors[value]} flex justify-between items-center hover:opacity-90 cursor-pointer transition-all rounded-lg">
        <PaintBucket class="size-4"/>
        <p>{value.charAt(0).toUpperCase()}{value.slice(1)}</p>
    </Popover.Trigger>

    <!-- Container to hold the color options -->
    <Popover.Portal>
        <Popover.Content 
            class="{popoverClass} bg-background-50 border border-background-300 rounded-lg p-3"
            sideOffset={offset}
            side={position} 
            sticky="partial"
            align={alignment}
        >
            <!-- On pressing the color button, the onChange function provided by the caller is used -->
            {#each Object.entries(colors) as [id, color]}
                <button 
                    class="rounded-lg bg-{color} size-6 flex items-center justify-center cursor-pointer" 
                    title="Color Selector Button for {id}"
                    aria-labelledby={id}
                    onclick={() => onChangeFn(id as ColorKey)}
                >
                    {#if id as ColorKey === value}
                        <Check class="size-4"/>
                    {/if}
                </button>
            {/each}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>
