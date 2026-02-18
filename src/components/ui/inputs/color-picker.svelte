<script lang="ts">
    import { ArrowDown, ArrowUp, Check, PaintBucket } from "@lucide/svelte";
    import { Select } from "bits-ui";
    import { type ColorKey, colors } from "@/components/util/color";

    interface PageProps {
        value: ColorKey, 
        onChangeFn: (color: ColorKey) => void
        offset?: number,
        buttonClass?: string
    }

    let { 
        value, 
        onChangeFn,
        offset = 15,
        buttonClass = "w-36 px-2",
    }: PageProps = $props()
</script>
 
<Select.Root 
    type="single"
    onValueChange={(v) => onChangeFn(v as ColorKey)}
>
    <!-- Button that opens the select menu -->
    <Select.Trigger class="{buttonClass} bg-{colors[value]} hover:opacity-90 flex items-center cursor-pointer transition-all rounded-lg">
        <PaintBucket class="size-4 text-{colors[value]} mr-2"/>

        <p class="rounded-lg">{value.charAt(0).toUpperCase()}{value.slice(1)}</p>
    </Select.Trigger>

    <Select.Portal>
        <Select.Content 
            sideOffset={offset}
            class="bg-background-50 border border-background-300 rounded-lg max-h-70"
        >
            <!-- Scroll up button for the menu -->
            <Select.ScrollUpButton class="flex justify-center p-2 pb-0 bg-background-50 rounded-lg">
                <ArrowUp class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
            </Select.ScrollUpButton>
            
            <!-- The main select menu -->
            <Select.Viewport class="w-(--bits-select-anchor-width) p-2 rounded-lg">
                <!-- On pressing the color button, the onChange function provided by the caller is used -->
                {#each Object.entries(colors) as [id]}
                    <Select.Item 
                        value={id}
                        class="flex justify-between items-center hover:bg-background-100 p-1 px-2 cursor-pointer rounded-lg"
                    >
                        <!-- Showcases a ticked checkbox  -->
                        {#if id === value}
                            <p> {id.charAt(0).toUpperCase()}{id.slice(1)} </p>
                            
                            <div class="bg-{colors[id as ColorKey]} size-4 flex justify-center items-center rounded-xs">
                                <Check 
                                    class="size-3 text-content-900"
                                    strokeWidth={5}
                                />
                            </div>
                        <!-- Showcases a unchecked checkbox  -->
                        {:else}
                            <p> {id.charAt(0).toUpperCase()}{id.slice(1)} </p>

                            <div class="border-2 border-{colors[id as ColorKey]} size-4 flex justify-center items-center rounded-xs"></div>
                        {/if} 
                    </Select.Item>
                {/each}
            </Select.Viewport>

            <!-- Scroll down button for the menu -->
            <Select.ScrollDownButton class="flex justify-center p-2 pt-0 bg-background-50 rounded-lg">
                <ArrowDown class="size-6 hover:bg-background-100 p-1 rounded-lg"/>
            </Select.ScrollDownButton>
        </Select.Content>
    </Select.Portal>
</Select.Root>