<script lang="ts">
    import { ArrowDown, ArrowUp, PaintBucket } from "@lucide/svelte";
    import { Select } from "bits-ui";
    import { type ColorKey, colors } from "@/components/util/color";
    import Checkbox from "./checkbox.svelte";

    interface PageProps {
        /** The value for the current color that is chosen by the user. */
        value: ColorKey, 

        /** Function that is called on change of the user's selected color */
        onChangeFn: (color: ColorKey) => void

        /** Classes to style the outer design of the trigger such as background colors, trigger hovers and width */
        triggerClass?: string
    }

    let { 
        value, 
        onChangeFn,
        triggerClass = "",
    }: PageProps = $props()
</script>
 
<Select.Root 
    type="single"
    onValueChange={(v) => onChangeFn(v as ColorKey)}
>
    <!-- Button that opens the select menu -->
    <Select.Trigger 
        class="{triggerClass} flex gap-x-4 items-center justify-between cursor-pointer"
        aria-label="Select a color from a list of colors"
    >
        <PaintBucket class="size-4 mx-1"/>

        <p class="rounded-lg capitalize w-25 px-2 bg-{colors[value]}">{value}</p>
    </Select.Trigger>

    <Select.Content 
        sideOffset={15}
        class="h-60 bg-background shadow-md rounded-lg p-1"
    >
        <!-- Scroll up button for the menu -->
        <Select.ScrollUpButton class="flex items-center justify-center py-1 mt-1 rounded-lg hover:bg-background-100">
            <ArrowUp class="size-4"/>
        </Select.ScrollUpButton>
        
        <!-- The main select menu -->
        <Select.Viewport class="w-(--bits-select-anchor-width)">
            <!-- On pressing the color button, the onChange function provided by the caller is used -->
            {#each Object.entries(colors) as [id]}
                <Select.Item 
                    value={id}
                    class="flex items-center justify-between data-highlighted:bg-background-100 cursor-pointer p-1 px-2 rounded-lg"
                    aria-label="Option to select the color '{id}'."
                >   
                    <p class="capitalize"> {id} </p>

                    <Checkbox
                        value={id == value}
                        checkedStyle="size-5 bg-{colors[id as ColorKey]} border border-{colors[id as ColorKey]}"
                        unCheckedStyle="size-5 border border-{colors[id as ColorKey]}"
                    />
                </Select.Item>
            {/each}
        </Select.Viewport>

        <!-- Scroll down button for the menu -->
        <Select.ScrollDownButton class="flex items-center justify-center py-1 mt-1 rounded-lg hover:bg-background-100">
            <ArrowDown class="size-4"/>
        </Select.ScrollDownButton>
    </Select.Content>
</Select.Root>